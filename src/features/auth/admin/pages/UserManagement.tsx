import profile from "@/assets/images/dummy-profile.webp";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  useBlockandunblockMutation,
  useFetchUsersMutation,
} from "@/services/apis/AuthApis";
import { errorTost } from "@/components/ui/tosastMessage";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { PageNation } from "@/components/ui/pageNation";

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
      console.log(response);

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
      <div className="flex justify-between items-center my-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-zinc-100">
          User Management
        </h1>
      </div>
      <div className="w-full  bg-slate-00 flex justify-end h-10 relative">
        <input
          type="text"
          placeholder="Search..."
          className="mr-[1rem] rounded-md border-2  text-sm h-full w-3/12 pl-3 dark:bg-zinc-900 focus:outline-none"
        />
        <Search size={20} className="absolute right-9 top-3" />
      </div>
      <div className="w-full h-5/6 py-[2rem] px-[3rem]">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow className=" w-full bg-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-800 ">
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-end">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex cursor-pointer items-center justify-start">
                    <img
                      src={profile}
                      alt="User profile"
                      className="h-8 w-8 rounded-full overflow-hidden object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isBlocked ? (
                    <span className="text-red-500 ">Blocked</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {
                    <Button
                      className={`${
                        user.isBlocked
                          ? "bg-red-700 hover:bg-red-800 text-white"
                          : "bg-green-800 hover:bg-green-900 text-white "
                      } min-w-24 `}
                      onClick={() =>
                        handileBlock(user.id, user.isBlocked ? false : true)
                      }
                    >
                      {user.isBlocked ? "Blocked" : " Active "}
                    </Button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pageNationData.totalPages > 1 && (
          <div className="w-full my-[3rem] flex justify-end pb-[1rem]">
            <PageNation
              pageNationData={pageNationData}
              fetchUserData={fetchUserData}
              setpageNationData={setPageNationData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
