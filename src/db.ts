import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Trip, User } from './types.js'; // Can also import relative to build format

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TRIPS_FILE = path.join(DATA_DIR, 'trips.json');

const JWT_SECRET = process.env.JWT_SECRET || 'ai-travel-planner-super-secret-key-13579';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure files exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(TRIPS_FILE)) {
  fs.writeFileSync(TRIPS_FILE, JSON.stringify([]));
}

// User representation in local file (includes credentials hash)
export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

// Atomic file writer helper
function writeJsonAtomic(filePath: string, data: any) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempPath, filePath);
}

// CRYPTO HELPERS FOR PASSWORDS
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// CRYPTO HELPERS FOR JWT TOKENS
export function generateToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${data}`).digest('base64url');
  return `${header}.${data}.${signature}`;
}

export function verifyToken(token: string): any {
  try {
    const [header, data, signature] = token.split('.');
    if (!header || !data || !signature) return null;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${data}`).digest('base64url');
    if (signature !== expectedSignature) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

// USERS DB
export function getUsers(): StoredUser[] {
  try {
    const content = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export function getUserByEmail(email: string): StoredUser | undefined {
  const cleanEmail = email.toLowerCase().trim();
  return getUsers().find((u) => u.email === cleanEmail);
}

export function getUserById(id: string): StoredUser | undefined {
  return getUsers().find((u) => u.id === id);
}

export function createUser(email: string, passwordPlain: string): StoredUser {
  const cleanEmail = email.toLowerCase().trim();
  const existing = getUserByEmail(cleanEmail);
  if (existing) {
    throw new Error('User already exists');
  }

  const { hash, salt } = hashPassword(passwordPlain);
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    email: cleanEmail,
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };

  const allUsers = getUsers();
  allUsers.push(newUser);
  writeJsonAtomic(USERS_FILE, allUsers);

  return newUser;
}

// TRIPS DB
export function getTrips(): Trip[] {
  try {
    const content = fs.readFileSync(TRIPS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export function getTripsByUserId(userId: string): Trip[] {
  return getTrips().filter((t) => t.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getTripById(tripId: string): Trip | undefined {
  return getTrips().find((t) => t.id === tripId);
}

export function createTrip(tripData: Omit<Trip, 'id' | 'createdAt'>): Trip {
  const newTrip: Trip = {
    ...tripData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const allTrips = getTrips();
  allTrips.push(newTrip);
  writeJsonAtomic(TRIPS_FILE, allTrips);

  return newTrip;
}

export function updateTrip(tripId: string, userId: string, updateFn: (trip: Trip) => Trip): Trip {
  const allTrips = getTrips();
  const index = allTrips.findIndex((t) => t.id === tripId);
  
  if (index === -1) {
    throw new Error('Trip not found');
  }

  const existingTrip = allTrips[index];
  if (existingTrip.userId !== userId) {
    throw new Error('Unauthorized access to this trip record');
  }

  const updatedTrip = updateFn(existingTrip);
  allTrips[index] = updatedTrip;
  writeJsonAtomic(TRIPS_FILE, allTrips);

  return updatedTrip;
}

export function deleteTrip(tripId: string, userId: string): void {
  const allTrips = getTrips();
  const index = allTrips.findIndex((t) => t.id === tripId);
  if (index === -1) {
    throw new Error('Trip not found');
  }

  if (allTrips[index].userId !== userId) {
    throw new Error('Unauthorized access to this trip record');
  }

  const filteredTrips = allTrips.filter((t) => t.id !== tripId);
  writeJsonAtomic(TRIPS_FILE, filteredTrips);
}
