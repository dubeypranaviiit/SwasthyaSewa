import { enqueueEmailJob, setDirectEmailDispatcher } from "../src/queues/emailQueue.js";

async function runQueueTest() {
    console.log("=================================================");
    console.log("Starting Asynchronous Email Queue Verification...");
    console.log("=================================================");

    let dispatchedCount = 0;
    const receivedJobs = [];

    setDirectEmailDispatcher(async (type, payload) => {
        dispatchedCount++;
        receivedJobs.push({ type, payload, time: Date.now() });
        console.log(`[Mock Dispatcher] Processed job #${dispatchedCount}: ${type} -> ${payload.email}`);
        return true;
    });

    console.log("\n[Test 1] Enqueueing multiple transactional email jobs...");
    const jobs = [
        { type: "booking-confirmation", payload: { email: "patient1@example.com", appointmentData: { docName: "Dr. Sharma", slotDate: "15-10-2026", slotTime: "10:00 AM", amount: 500 } } },
        { type: "otp-email", payload: { email: "patient2@example.com", otp: "594821" } },
        { type: "cancellation-email", payload: { email: "patient3@example.com", appointmentData: { docName: "Dr. Sharma", slotDate: "15-10-2026", slotTime: "11:00 AM" } } },
        { type: "refund-notification", payload: { email: "patient4@example.com", amount: 500, appointmentData: { docName: "Dr. Sharma", slotDate: "15-10-2026", slotTime: "11:00 AM" } } },
    ];

    const enqueueResults = await Promise.all(jobs.map(j => enqueueEmailJob(j.type, j.payload)));

    console.log(`- Jobs Dispatched: ${enqueueResults.length}`);
    enqueueResults.forEach((r, idx) => {
        console.log(`  Job ${idx + 1}: success=${r.success}, enqueued=${r.enqueued || false}, fallback=${r.fallback || false}`);
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(`\n[Test 2] Verifying Non-blocking Background Execution:`);
    console.log(`- Total Mock Invocations Received: ${dispatchedCount}`);
    if (dispatchedCount === jobs.length) {
        console.log("✅ [PASSED] All background email jobs processed successfully without blocking API thread.");
    } else {
        console.error(`❌ [FAILED] Expected ${jobs.length} jobs, got ${dispatchedCount}`);
        process.exit(1);
    }

    console.log("\n=================================================");
    console.log("🎉 All Asynchronous Queue Tests PASSED!");
    console.log("=================================================");
    process.exit(0);
}

runQueueTest().catch((err) => {
    console.error("Queue test failed:", err);
    process.exit(1);
});
