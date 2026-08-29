import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedUsers, seedCompanies, seedInternships, seedApplications, seedNotifications, seedConversations } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'db.json');

class Store {
  constructor() {
    this.users = [];
    this.companies = [];
    this.internships = [];
    this.applications = [];
    this.notifications = [];
    this.conversations = [];
    this.otpStore = new Map(); // email -> { otp, expiresAt, attempts }
    this.liveViewers = new Map(); // internshipId -> Set of socketIds
    this.locks = new Map(); // resourceId -> Promise chain (pessimistic locking)
    this.init();
  }

  init() {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || seedUsers;
        this.companies = data.companies || seedCompanies;
        this.internships = data.internships || seedInternships;
        this.applications = data.applications || seedApplications;
        this.notifications = data.notifications || seedNotifications;
        this.conversations = data.conversations || seedConversations;
        return;
      } catch (err) {
        console.warn('Could not parse existing db.json, reinitializing from seed data.', err);
      }
    }

    this.users = [...seedUsers];
    this.companies = [...seedCompanies];
    this.internships = [...seedInternships];
    this.applications = [...seedApplications];
    this.notifications = [...seedNotifications];
    this.conversations = [...seedConversations];
    this.save();
  }

  save() {
    try {
      const payload = {
        users: this.users,
        companies: this.companies,
        internships: this.internships,
        applications: this.applications,
        notifications: this.notifications,
        conversations: this.conversations,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving store to disk:', err);
    }
  }

  // Pessimistic Mutex Lock for Concurrency-Safe operations (Capacity Allocation)
  async acquireLock(resourceId, taskFn) {
    const prevLock = this.locks.get(resourceId) || Promise.resolve();
    let release;
    const currentLock = new Promise((resolve) => { release = resolve; });
    this.locks.set(resourceId, prevLock.then(() => currentLock));

    await prevLock;
    try {
      return await taskFn();
    } finally {
      release();
      if (this.locks.get(resourceId) === currentLock) {
        this.locks.delete(resourceId);
      }
    }
  }

  // OTP Helpers
  setOtp(email, otp, ttlMs = 5 * 60 * 1000) {
    const norm = email.toLowerCase().trim();
    this.otpStore.set(norm, {
      otp: String(otp),
      expiresAt: Date.now() + ttlMs,
      attempts: 0
    });
  }

  getOtp(email) {
    const norm = email.toLowerCase().trim();
    return this.otpStore.get(norm);
  }

  clearOtp(email) {
    const norm = email.toLowerCase().trim();
    this.otpStore.delete(norm);
  }
}

export const store = new Store();
export default store;
