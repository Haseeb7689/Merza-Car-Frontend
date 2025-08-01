"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchTeamMembers, Member } from "@/utils/apiGet";

export default function Cards() {
  const [data, setData] = useState<Member[]>([]);

  useEffect(() => {
    const load = async () => {
      const team = await fetchTeamMembers();
      setData(team);
    };
    load();
  }, []);

  return (
    <div className="flex flex-wrap -mx-3">
      {data.map((member) => (
        <div key={member.id} className="w-full sm:w-1/2 lg:w-1/3 px-3 mb-6">
          <div className="block rounded-lg shadow-md p-4 bg-white border hover:shadow-xl hover:cursor-pointer transition-all">
            <div className="space-y-1">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${member.imageUrl}`}
                alt={member.name}
                width={400}
                height={300}
                priority
                className="h-[300px] w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-3xl text-orange-600 font-semibold">
                {member.name}
              </h3>
              <p className="text-xl mb-5 text-orange-600">{member.role}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
              <p className="text-sm text-gray-500">{member.phone}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
