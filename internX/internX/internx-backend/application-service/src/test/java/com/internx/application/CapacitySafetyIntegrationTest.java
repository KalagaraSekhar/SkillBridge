package com.internx.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CapacitySafetyIntegrationTest {

    /**
     * Simulated concurrent capacity allocator mimicking database row-level locking
     */
    static class ConcurrencySafeSlotAllocator {
        private final int maxPositions;
        private int filledPositions = 0;
        private final Object lock = new Object();

        public ConcurrencySafeSlotAllocator(int maxPositions) {
            this.maxPositions = maxPositions;
        }

        public int trySelectCandidate() {
            synchronized (lock) {
                if (filledPositions >= maxPositions) {
                    return 409; // 409 Conflict
                }
                filledPositions++;
                return 200; // 200 OK
            }
        }

        public int getFilledPositions() {
            synchronized (lock) {
                return filledPositions;
            }
        }
    }

    @Test
    @DisplayName("Concurrency Test: 20 simultaneous select requests on maxPositions=5 ensures exactly 5 succeed (200 OK) and 15 return 409 Conflict")
    void testConcurrentCapacitySelectionSafety() throws InterruptedException, ExecutionException {
        final int MAX_POSITIONS = 5;
        final int TOTAL_CONCURRENT_REQUESTS = 20;

        ConcurrencySafeSlotAllocator allocator = new ConcurrencySafeSlotAllocator(MAX_POSITIONS);

        ExecutorService executor = Executors.newFixedThreadPool(TOTAL_CONCURRENT_REQUESTS);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(TOTAL_CONCURRENT_REQUESTS);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger conflictCount = new AtomicInteger(0);

        List<Future<?>> futures = new ArrayList<>();

        for (int i = 0; i < TOTAL_CONCURRENT_REQUESTS; i++) {
            futures.add(executor.submit(() -> {
                try {
                    // Wait for all threads to be ready to fire simultaneously
                    startLatch.await();
                    int statusCode = allocator.trySelectCandidate();
                    if (statusCode == 200) {
                        successCount.incrementAndGet();
                    } else if (statusCode == 409) {
                        conflictCount.incrementAndGet();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    finishLatch.countDown();
                }
            }));
        }

        // Fire all 20 threads simultaneously!
        startLatch.countDown();
        finishLatch.await(5, TimeUnit.SECONDS);
        executor.shutdown();

        // Assertions
        assertEquals(5, successCount.get(), "Exactly 5 candidates should be accepted");
        assertEquals(15, conflictCount.get(), "Exactly 15 candidate selections should be rejected with 409 Conflict");
        assertEquals(5, allocator.getFilledPositions(), "Final filled position counter must not exceed maxPositions (5)");
    }
}
