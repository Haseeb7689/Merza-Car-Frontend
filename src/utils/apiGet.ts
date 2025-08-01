export interface Member {
  name: string;
  email: string;
  phone: string;
  role: string;
  id: string;
  imageUrl: string;
}

export const fetchTeamMembers = async (): Promise<Member[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
};
