"use client";

import React, { memo, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import employeeService, { TEmployee } from "@/services/emloyee.service";
import { useFilterStore } from "@/stores/filter.store";
import { EUserStatus } from "@/types/user";
import CreateEmployee from "./form-create";
import { DeleteBtn } from "./delete-btn";
import EditEmployee from "./form-edit";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const columns = [
  {
    key: "name",
    label: "Employee Name",
    width: "100px",
  },
  {
    key: "email",
    label: "Email",
    width: "100px",
  },
  {
    key: "status",
    label: "Status",
    width: "20px",
  },
  {
    key: "action",
    label: "Action",
    width: "100px",
  },
];

const StatusCell = ({ status }: { status: EUserStatus }) => {
  switch (status) {
    case EUserStatus.ACTIVE:
      return (
        <div className="bg-green-500 text-white px-2 py-1 rounded-md">
          ACTIVE
        </div>
      );
    case EUserStatus.INACTIVE:
      return (
        <div className="bg-red-500 text-white px-2 py-1 rounded-md">
          INACTIVE
        </div>
      );
    case EUserStatus.PENDING:
      return (
        <div className="bg-yellow-500 text-white px-2 py-1 rounded-md">
          PENDING
        </div>
      );
  }
};

const ListTableHead = () => {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableHead key={column.key}>{column.label}</TableHead>
      ))}
    </TableRow>
  );
};

const ActionCell = ({ id }: { id: string }) => {
  return (
    <div className="flex gap-2">
      <EditEmployee id={id} />
      <DeleteBtn id={id} />
    </div>
  );
};

const EmployeeTable = memo(function EmployeeTable({
  employees,
}: {
  employees: TEmployee[];
}) {
  return (
    <Table>
      <TableCaption>A list of your recent employees.</TableCaption>
      <TableHeader>
        <ListTableHead />
      </TableHeader>
      <TableBody>
        {employees?.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium">{employee.fullName}</TableCell>
            <TableCell className="text-left ">{employee.email}</TableCell>
            <TableCell>
              <StatusCell status={employee.status} />
            </TableCell>
            <TableCell>
              <ActionCell id={employee.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

const EmployeeManagement = () => {
  const { filters, page, limit } = useFilterStore();
  const { data: employees } = useQuery({
    queryKey: ["employees", filters, page, limit],
    queryFn: () => employeeService.getList({ filters, page, limit }),
  });

  return (
    <div>
      <div>
        <h1>Employee Management</h1>
        <div className="flex justify-between items-center">
          <div>{employees?.pagination.total} employees</div>

          <div className="flex gap-2">
            <CreateEmployee />
            <SearchEmployee />
          </div>
        </div>
      </div>
      <div>
        <EmployeeTable employees={employees?.result ?? []} />
      </div>
    </div>
  );
};

const SearchEmployee = () => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { filters, setData } = useFilterStore();
  function debounceSearch(value: string) {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setData({ ...filters, keyword: value }, 1, 10);
    }, 800);
  }
  return (
    <div className="flex items-center gap-2 w-full mr-2">
      <Input
        placeholder="Search Employee"
        className="w-full"
        onChange={(e) => debounceSearch(e.target.value)}
      />
    </div>
  );
};

export default EmployeeManagement;
