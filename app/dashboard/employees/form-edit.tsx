import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { EUserRole } from "@/types/user";
import employeeService from "@/services/emloyee.service";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";

const editEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(2, "Employee name must be at least 2 characters")
    .max(100, "Employee name must be less than 100 characters"),
  phoneNumber: z.string().regex(/^[0-9]{8,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(EUserRole),
  address: z.string(),
});

type TEditEmployee = z.infer<typeof editEmployeeSchema>;

type TEditEmployeeProps = {
  id: string;
};

const EditEmployee = ({ id }: TEditEmployeeProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white">Edit</Button>
      </DialogTrigger>
      <DialogContent className="!w-[80%] !max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Employee</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <EditForm id={id} />
      </DialogContent>
    </Dialog>
  );
};

type TEditFormProps = {
  id: string;
};

const EditForm = ({ id }: TEditFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<TEditEmployee>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      role: EUserRole.EMPLOYEE,
      address: "",
    },
  });

  const { data: employee } = useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeeService.getById(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });

  const mutate = useMutation({
    mutationFn: (data: TEditEmployee) => employeeService.update(id, data),
    onSuccess: () => {
      toast.success("Employee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      toast.error("Employee update failed");
    },
  });

  const onSubmit = (data: TEditEmployee) => {
    mutate.mutate(data);
  };

  useEffect(() => {
    if (employee) {
      form.reset(employee);
    }
  }, [employee, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="fullName"
            control={form.control}
            formLabelProps={{ title: "Name" }}
          />
          <FormInput
            name="phoneNumber"
            control={form.control}
            formLabelProps={{ title: "Phone Number" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="email"
            control={form.control}
            formLabelProps={{ title: "Email" }}
          />
          <FormInput
            name="role"
            control={form.control}
            formLabelProps={{ title: "Role" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="address"
            control={form.control}
            formLabelProps={{ title: "Address" }}
          />
        </div>

        <Button
          type="submit"
          className="ml-auto block"
          disabled={mutate.isPending}
        >
          Save
        </Button>
      </form>
    </Form>
  );
};

export default EditEmployee;
