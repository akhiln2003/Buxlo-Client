import AddWalletAndBankAccount from "../components/AddWalletAndBankAccount";
import { Areachart } from "../components/AreaChart";
import { Barchart } from "../components/BarChart";
import { Piechart } from "../components/PieChart ";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



function dashBoard() {
  return (
    <div className="w-full flex flex-col">
      <AddWalletAndBankAccount />
      <div className=" w-full flex justify-center my-5"> <input type="date" className="border border-black dark:border-white p-2 rounded-md" /></div>

      <div className="w-full min-h-screen  flex space-x-1 pt-5">
        <div className="w-1/3 ">
          <Piechart />
        </div>
        <div className="w-1/3 ">
          <Areachart />
        </div>
        <div className="w-1/3">
          <Barchart />
        </div>
        
      </div>

      <div className=" w-full px-10 pt-5 ">
      <Table className="bg-zinc-300  dark:bg-zinc-900 rounded-sm">
      <TableCaption>A list of registered users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>1</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>john.doe@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane.smith@example.com</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>3</TableCell>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob.johnson@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
      </div>
    </div>
  );
}
  
export default dashBoard;
