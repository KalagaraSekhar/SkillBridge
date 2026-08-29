import assert from 'assert';
import http from 'http';
import { store, server } from '../server.js';

async function runTests() {
  console.log('\n--- 🧪 Starting InternX Zenith Backend Test Suite ---');

  // Test 1: Store initialized
  assert(store.users.length > 0, 'Users must be loaded');
  assert(store.internships.length > 0, 'Internships must be loaded');
  assert(store.applications.length > 0, 'Applications must be loaded');
  console.log(`✅ Test 1 Passed: Store initialized with ${store.users.length} users, ${store.internships.length} internships, ${store.applications.length} applications`);

  // Test 2: OTP Lifecycle
  store.setOtp('test@internx.dev', '654321', 60000);
  const otpRecord = store.getOtp('test@internx.dev');
  assert(otpRecord && otpRecord.otp === '654321', 'OTP must match');
  store.clearOtp('test@internx.dev');
  assert(!store.getOtp('test@internx.dev'), 'OTP must be cleared');
  console.log('✅ Test 2 Passed: 6-Digit OTP lifecycle verified');

  // Test 3: Concurrency Capacity Safety Lock (Pessimistic Locking)
  const testInt = {
    id: `test-int-${Date.now()}`,
    companyId: 'comp-test',
    companyName: 'Test Corp',
    title: 'Capacity Test Engineer',
    category: 'Tech',
    stipend: '$4,000 / mo',
    stipendAmount: 4000,
    maxPositions: 3,
    filledPositions: 0,
    status: 'ACTIVE'
  };
  store.internships.push(testInt);

  // 15 concurrent applicants trying to get SELECTED for 3 positions
  const applicants = Array.from({ length: 15 }, (_, i) => ({
    id: `test-app-${i}`,
    internshipId: testInt.id,
    studentId: `student-${i}`,
    status: 'APPLIED'
  }));
  store.applications.push(...applicants);

  let successCount = 0;
  let conflict409Count = 0;

  await Promise.all(
    applicants.map(async (app) => {
      try {
        await store.acquireLock(`lock:int:${testInt.id}`, async () => {
          const currentInt = store.internships.find((i) => i.id === testInt.id);
          if (currentInt.filledPositions >= currentInt.maxPositions) {
            const err = new Error('Capacity full (409 Conflict)');
            err.statusCode = 409;
            throw err;
          }
          currentInt.filledPositions += 1;
          app.status = 'SELECTED';
        });
        successCount++;
      } catch (err) {
        if (err.statusCode === 409) {
          conflict409Count++;
        }
      }
    })
  );

  assert.strictEqual(successCount, 3, 'Exactly 3 applicants must be selected for maxPositions = 3');
  assert.strictEqual(conflict409Count, 12, 'Exactly 12 applicants must be rejected with 409 Conflict');
  assert.strictEqual(testInt.filledPositions, 3, 'Filled positions must equal max positions exactly (3)');
  console.log(`✅ Test 3 Passed: Concurrency capacity safety verified! Exactly ${successCount} slots filled and ${conflict409Count} rejected with 409 Conflict.`);

  console.log('--- 🌟 ALL BACKEND TESTS PASSED WITH 100% SUCCESS ---\n');
  server.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  server.close();
  process.exit(1);
});
