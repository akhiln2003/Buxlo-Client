import profile from "@/assets/images/dummy-profile.webp";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  useBlockandunblockMutation,
  useFetchMentorsMutation,
} from "@/services/apis/AuthApis";
import { errorTost } from "@/components/ui/tosastMessage";
import { Button } from "@/components/ui/button";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { IuserDB } from "@/@types/interface/IdataBase";

function MentorManagement() {
  const [fetchUsers] = useFetchMentorsMutation();
  const [userAction] = useBlockandunblockMutation();

  const [users, setUsers] = useState<IuserDB[]>([]);

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
        const role = "mentor";
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
        console.error("Error fetching users:", err);
        errorTost("SomThing wrong", [
          { message: "Somting when wrong please try again" },
        ]);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className="w-full h-full p-5 ">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-zinc-100">
          Mentor Management
        </h1>
      </div>

      <div className="w-full py-[2rem] px-[3rem]">
        <Table>
          <TableHeader>
            <TableRow className=" w-full bg-zinc-200 dark:bg-zinc-800 dark:bfz ">
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
        <div className="w-full h-8  mt-[3rem]  flex justify-end pr-[2rem]">
          <div className="w-2/12 min-h-full max-h-full bg-zinc-200 roundend flex justify-between items-center py-[1.5rem] px-[0.5rem] rounded-s">
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

export default MentorManagement;
