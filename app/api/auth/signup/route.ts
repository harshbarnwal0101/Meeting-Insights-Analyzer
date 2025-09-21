import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Organization from '@/models/Organization';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { email, password, displayName, orgName, role } = await req.json();

    if (!email || !password || !displayName || !orgName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    let organization = await Organization.findOne({ name: orgName });
    if (!organization) {
      organization = await Organization.create({ name: orgName });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      displayName,
      orgId: organization._id,
      role: role || 'user',
    });

    return NextResponse.json({ success: true, userId: user._id }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
