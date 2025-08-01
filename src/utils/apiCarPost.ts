export async function addCarData(formData: FormData) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/car`, {
      method: "POST",
      body: formData,
    });

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "File upload failed");
      }

      return data;
    } else {
      const raw = await res.text();
      console.error("❌ Unexpected non-JSON response:", raw);
      throw new Error("Received non-JSON response");
    }
  } catch (error) {
    console.error("❌ postFile error:", error);
    throw error;
  }
}
