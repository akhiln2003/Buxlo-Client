import profile from "@/assets/images/dummy-profile.webp";
import { useEffect, useState } from "react";
import {
  useBlockandunblockMutation,
  useFetchUsersMutation,
} from "@/services/apis/AuthApis";
import { errorTost } from "@/components/ui/tosastMessage";
import { Search } from "lucide-react";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { ColumnConfig, TableList } from "@/components/ui/tableList";

type ExtendedUser = User & { profile?: string };

const columns: ColumnConfig<ExtendedUser>[] = [
  {
    key: "profile",
    label: "Profile",
    render: () => (
      <img
        src={profile}
        alt="User profile"
        className="h-8 w-8 rounded-full object-cover"
      />
    ),
  },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "isBlocked",
    label: "Status",
    render: (val) =>
      val === true ? (
        <span className="text-red-500">Blocked</span>
      ) : (
        <span className="text-green-500">Active</span>
      ),
  },
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  isBlocked: boolean;
  isGoogle: boolean;
  createdAt: string;
  updatedAt: string;
}

function UserManagement() {
  const [fetchUsers] = useFetchUsersMutation();
  const [userAction] = useBlockandunblockMutation();

  const [users, setUsers] = useState<User[]>([]);
  const [pageNationData, setPageNationData] = useState({
    pageNum: 1,
    totalPages: 0,
  });

  const handileBlock = async (id: string, isBlocked: boolean) => {
    const response: IaxiosResponse = await userAction({ id, isBlocked });
    if (response.data) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isBlocked: isBlocked } : user
        )
      );
    } else {
      errorTost(
        "Somthing when wrong ",
        response.error.data.error || [
          { message: `${response.error.data} please try again laiter` },
        ]
      );
    }
  };
  const fetchUserData = async (page = 1, searchData = undefined) => {
    try {
      const response: IaxiosResponse = await fetchUsers({ page, searchData }); // `unwrap` gets the raw response

      if (response.data) {
        setUsers(response.data.data.users);
        setPageNationData((prev) => ({
          ...prev,
          totalPages: response.data.data.totalPages,
        }));
      } else {
        errorTost(
          "Somthing when wrong ",
          response.error.data.error || [
            { message: `${response.error.data} please try again laiter` },
          ]
        );
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      errorTost("SomThing wrong", [
        { message: "Somting when wrong please try again" },
      ]);
    }
  };
  useEffect(() => {
    fetchUserData(pageNationData.pageNum);
  }, []);

  return (
    <div className="w-full h-full p-5">
      <div className="w-full mt-2 bg-slate-00 flex justify-end h-10 relative">
        <input
          type="text"
          placeholder="Search..."
          className="mr-[1rem] rounded-md border-2  text-sm h-full w-3/12 pl-3 dark:bg-zinc-900 focus:outline-none"
        />
        <Search size={20} className="absolute right-9 top-3" />
      </div>
      <TableList
        title="User Management"
        columns={columns}
        data={users}
        onAction={handileBlock}
        pagination={pageNationData}
        onPageChange={async (page) => await fetchUserData(page)}
      />
    </div>
  );
}

export default UserManagement;
