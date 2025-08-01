export async function addTeamMember(formData: FormData) {
  {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add member");

      return data;
    } catch (error) {
      console.error("Add member error:", error);
      throw error;
    }
  }
}
