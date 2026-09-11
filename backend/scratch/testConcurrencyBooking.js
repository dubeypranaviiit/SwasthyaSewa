import { acquireSlotHold, releaseSlotHold, getSlotHoldStatus } from "../src/services/slotLockService.js";

async function runConcurrencyTest() {
    console.log("=================================================");
    console.log("Starting Concurrency Slot-Locking Verification...");
    console.log("=================================================");

    const docId = "doc_test_101";
    const slotDate = "15-10-2026";
    const slotTime = "10:30 AM";
    const totalRequests = 50;

    console.log(`\n[Test 1] Simulating ${totalRequests} simultaneous requests for slot: ${slotDate} ${slotTime}...`);

    const promises = [];
    for (let i = 1; i <= totalRequests; i++) {
        const userId = `user_${i}`;
        promises.push(
            acquireSlotHold(docId, slotDate, slotTime, userId, 30).then((res) => ({
                userId,
                ...res,
            }))
        );
    }

    const results = await Promise.all(promises);

    const successful = results.filter((r) => r.acquired);
    const rejected = results.filter((r) => !r.acquired);

    console.log(`- Total Requests Sent: ${totalRequests}`);
    console.log(`- Successfully Acquired: ${successful.length} (Winner: ${successful[0]?.userId})`);
    console.log(`- Rejected (409 Conflict): ${rejected.length}`);

    if (successful.length === 1 && rejected.length === totalRequests - 1) {
        console.log("✅ [PASSED] Exactly 1 request acquired exclusive lock; 49 requests received conflict.");
    } else {
        console.error(`❌ [FAILED] Expected 1 success and ${totalRequests - 1} rejections. Got ${successful.length} successes.`);
        process.exit(1);
    }

    const status = await getSlotHoldStatus(docId, slotDate, slotTime);
    console.log(`\n[Test 2] Slot Hold Status Verification:`);
    console.log(`- Is Held: ${status.isHeld}`);
    console.log(`- Holder: ${status.holderId}`);
    console.log(`- Remaining TTL: ${status.ttl}s`);

    if (status.isHeld && status.holderId === successful[0].userId) {
        console.log("✅ [PASSED] Slot status correctly reports winning lock holder.");
    } else {
        console.error("❌ [FAILED] Slot status mismatch.");
        process.exit(1);
    }

    console.log(`\n[Test 3] Owner Re-confirmation Verification:`);
    const ownerReconfirm = await acquireSlotHold(docId, slotDate, slotTime, successful[0].userId, 30);
    if (ownerReconfirm.acquired && ownerReconfirm.isOwner) {
        console.log("✅ [PASSED] Lock owner can re-confirm/extend hold without 409 conflict.");
    } else {
        console.error("❌ [FAILED] Lock owner failed to re-confirm hold.");
        process.exit(1);
    }

    console.log(`\n[Test 4] Safe Lock Release & Ownership Enforcement:`);
    const imposterRelease = await releaseSlotHold(docId, slotDate, slotTime, "imposter_user");
    console.log(`- Imposter release result: released=${imposterRelease.released}`);
    if (!imposterRelease.released) {
        console.log("✅ [PASSED] Unauthorized user cannot release another patient's lock.");
    } else {
        console.error("❌ [FAILED] Imposter was able to release lock.");
        process.exit(1);
    }

    const ownerRelease = await releaseSlotHold(docId, slotDate, slotTime, successful[0].userId);
    console.log(`- Owner release result: released=${ownerRelease.released}`);
    if (ownerRelease.released) {
        console.log("✅ [PASSED] True owner successfully released lock.");
    } else {
        console.error("❌ [FAILED] Owner failed to release lock.");
        process.exit(1);
    }

    console.log(`\n[Test 5] Re-acquisition after release:`);
    const newAcquire = await acquireSlotHold(docId, slotDate, slotTime, "user_new_claimant", 30);
    if (newAcquire.acquired) {
        console.log("✅ [PASSED] Released slot can be immediately claimed by new patient.");
        await releaseSlotHold(docId, slotDate, slotTime, "user_new_claimant");
    } else {
        console.error("❌ [FAILED] Failed to acquire released slot.");
        process.exit(1);
    }

    console.log("\n=================================================");
    console.log("🎉 All Distributed Slot-Locking Tests PASSED!");
    console.log("=================================================");
    process.exit(0);
}

runConcurrencyTest().catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
});
