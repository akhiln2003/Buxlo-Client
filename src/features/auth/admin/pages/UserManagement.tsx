import { AdminUrls } from "@/@types/urlEnums/AdminUrl";
import { Link } from "react-router-dom";
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
import { IaxiosResponse } from "../@types/IaxiosResponse";

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
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const role = "user";
        const response: IaxiosResponse = await fetchUsers(role); // `unwrap` gets the raw response
        if (response.data) {
          setUsers(response.data.data);
        } else {
          errorTost(
            "Somthing when wrong ",
            response.error.data.error || [
              { message: `${response.error.data} please try again laiter` },
            ]
          );
        }
      } catch (err) {
        console.log("Error fetching users:", err);
        errorTost("SomThing wrong", [
          { message: "Somting when wrong please try again" },
        ]);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className="w-full h-full ">
      <div className="w-full h-1/6 ">
        <p className="font-cabinet font-medium text-xl ml-[1rem]">
          UserManagement
        </p>
        <div className="ml-[1.5rem] mt-1">
          <Link to={AdminUrls.dashbord}>
            <span className="font-cabinet font-extralight text-xs mr-1">
              Dashbord
            </span>
          </Link>
          <span className="font-cabinet font-extralight text-xs">
            / UserManagement
          </span>
        </div>
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
        <div className="w-full  my-[3rem]  flex justify-end pb-[1rem] ">
          <div className="w-2/12 min-h-full max-h-full   flex justify-between items-center rounded-s">
            <Button className=" p-[0.5rem] bg-zinc-600 rounded-sm">Prev</Button>
            <h3>1</h3>
            <h3>1</h3>
            <h3>1</h3>
            <p>..</p>
            <Button className=" p-[0.5rem]  bg-zinc-600 rounded-sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
