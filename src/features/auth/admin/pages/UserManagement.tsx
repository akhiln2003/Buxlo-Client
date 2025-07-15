import profile from "@/assets/images/dummy-profile.webp";
import { useEffect, useState } from "react";
import {
  useBlockandunblockMutation,
  useFetchUsersMutation,
} from "@/services/apis/AuthApis";
import { errorTost } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { ColumnConfig, TableList } from "@/components/ui/tableList";
import SearchInput from "@/components/ui/searchInput";

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
  const [searchQuery, setSearchQuery] = useState<string>("");
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
  const fetchUserData = async (page = 1, searchData = searchQuery) => {
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
  }, [searchQuery]);

  return (
    <div className="w-full h-full p-5">
      <div className="w-full mt-2 bg-slate-00 flex justify-end h-10">
        <SearchInput
          onSearch={(value) => setSearchQuery(value)}
          debounceDelay={400}
          className="w-1/4 "
        />
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
