export const processMessage = async ({ name, message, shouldFail }) => {
  console.log("=================================");
  console.log("Processing message");
  console.log("Name:", name);
  console.log("Message:", message);

  // Simulate expensive work
  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (shouldFail) {
    throw new Error("Intentional job failure for testing");
  }

  console.log("Message processed successfully");

  return {
    success: true,
    message: `Message processed for ${name}`,
  };
};
