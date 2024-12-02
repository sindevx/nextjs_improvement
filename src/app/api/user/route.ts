import { NextRequest, NextResponse } from 'next/server';

const users = [
  { id: 1, name: 'Somchai Sawatdee' },
  { id: 2, name: 'Sunaree Rachasima' },
  { id: 3, name: 'Nattakarn Chaimongkol' },
  { id: 4, name: 'Paweena Bua-ban' },
  { id: 5, name: 'Thanakorn Promyotha' },
  { id: 6, name: 'Supachai Pantawee' },
  { id: 7, name: 'Pimphan Khammool' },
  { id: 8, name: 'Thitaya Bua-luang' },
  { id: 9, name: 'Thipawan Charoenmongkol' },
  { id: 10, name: 'Chalita Rungroj' },
];

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.id || !data.name) {
    return NextResponse.json(
      { message: 'ID and name are required' },
      { status: 400 }
    );
  }
  users.push(data);
  return NextResponse.json(
    { message: `User created with id ${data.id}`, user: data },
    { status: 201 }
  );
}

// Get a user or all users
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name');
  if (name) {
    const user = users.find((user) => user.name === name);
    if (user) {
      return NextResponse.json(user);
    }
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(users);
}

// Update a user
export async function PUT(req: NextRequest) {
  const data = await req.json();
  if (!data.id || !data.name) {
    return NextResponse.json(
      { message: 'ID and name are required' },
      { status: 400 }
    );
  }

  const idx = users.findIndex((user) => user.id === data.id);
  if (idx === -1) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  users[idx] = data;
  return NextResponse.json(
    { message: `User with id ${data.id} updated`, user: data },
    { status: 200 }
  );
}

// Delete a user
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json(
      { message: 'ID is required' },
      { status: 400 }
    );
  }

  const idx = users.findIndex((user) => user.id === parseInt(id));
  if (idx === -1) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  users.splice(idx, 1);
  return NextResponse.json(
    { message: `User with id ${id} deleted` },
    { status: 200 }
  );
}
