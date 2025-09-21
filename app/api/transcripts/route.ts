import { NextResponse } from 'next/server';
import { checkAuthorization } from '@/lib/rbac';
import dbConnect from '@/lib/mongoose';
import Meeting from '@/models/Meeting';
import Transcript from '@/models/Transcript';
import Score from '@/models/Score';
import { analyzeTranscript } from '@/lib/gemini';

// POST /api/transcripts
// Body: { meetingId?: string; meetingName?: string; text: string }
export async function POST(req: Request) {
  const { session, error } = await checkAuthorization(['admin', 'user']);
  if (error) return error;

  // We can be sure session is not null because of the check above
  const user = session!.user;

  await dbConnect();

  try {
    const { meetingId: providedMeetingId, meetingName, text } = await req.json();

    if (!text) {
      return NextResponse.json({ message: 'Text is required' }, { status: 400 });
    }

    let meetingId = providedMeetingId;

    // If no meetingId is provided, create/find a meeting (by meetingName if given, otherwise create a dated one)
    if (!meetingId) {
      let name = meetingName?.trim();
      if (!name) name = `Meeting on ${new Date().toLocaleDateString()}`;

      // Attempt to find an existing meeting by name for this user
      let meeting = await Meeting.findOne({ name, userId: user.id });
      if (!meeting) {
        meeting = await Meeting.create({ name, userId: user.id, orgId: user.orgId });
      }
      meetingId = meeting._id;
    }

    // Save the transcript
    const transcript = await Transcript.create({
      meetingId,
      text,
      processed: false,
    });

    // Analyze the transcript
    const analysisResult = await analyzeTranscript(text);

    // Save the score
    const score = await Score.create({
      transcriptId: transcript._id,
      ...analysisResult,
    });

    // Mark the transcript as processed
    transcript.processed = true;
    await transcript.save();

    return NextResponse.json({ transcript, score }, { status: 201 });
  } catch (error) {
    console.error('Error processing transcript:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/transcripts?meetingId=...&limit=5
// Returns latest transcripts and scores for a meeting
export async function GET(req: Request) {
  const { session, error } = await checkAuthorization(['admin', 'user']);
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const meetingId = searchParams.get('meetingId');
  const limit = Number(searchParams.get('limit') || 5);
  if (!meetingId) {
    return NextResponse.json({ message: 'meetingId is required' }, { status: 400 });
  }

  await dbConnect();

  try {
    const transcripts = await Transcript.find({ meetingId })
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 10))
      .lean();

    const scores = await Promise.all(
      transcripts.map(async (t) => {
        const s = await Score.findOne({ transcriptId: t._id }).lean();
        return { transcript: t, score: s };
      })
    );

    return NextResponse.json({ items: scores });
  } catch (e) {
    console.error('Error fetching transcripts:', e);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
