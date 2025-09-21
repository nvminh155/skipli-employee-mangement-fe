"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import employeeService from "@/services/emloyee.service";
import { useFilterStore } from "@/stores/filter.store";

const columns = [{
  key: "name",
  label: "Employee Name",
}, {
  key: "email",
  label: "Email",
}, {
  key: "status",
  label: "Status",
}, {
  key: "action",
  label: "Action",
}];

const ListTableHead = () => {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableHead className="w-[100px]" key={column.key}>
          {column.label}
        </TableHead>
      ))}
    </TableRow>
  );
};
const MyTable = () => {
  const { filters, page, limit } = useFilterStore();
  const {data: employees} = useQuery({
    queryKey: ["employees", filters, page, limit],
    queryFn: () => employeeService.getList({ filters, page, limit }),
  });

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <ListTableHead />
      </TableHeader>
      <TableBody>
        {employees?.result?.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium">{employee.fullName}</TableCell>
            <TableCell className="text-right">{employee.email}</TableCell>
            <TableCell>{employee.status}</TableCell>
            <TableCell>edit|delete</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
const EmployeeManagement = () => {
  return (
    <div>
      <div>
        <h1>Employee Management</h1>
      </div>
      <div>
        <MyTable />
      </div>
    </div>
  );
};

export default EmployeeManagement;
