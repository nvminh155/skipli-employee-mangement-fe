import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {  useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { EUserRole } from "@/types/user";
import employeeService from "@/services/emloyee.service";
import { useMutation } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";

const createEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(2, "Employee name must be at least 2 characters")
    .max(100, "Employee name must be less than 100 characters"),
  phoneNumber: z.string().regex(/^[0-9]{8,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  role: z.nativeEnum(EUserRole),
  address: z.string(),
});

type TCreateEmployee = z.infer<typeof createEmployeeSchema>;

const CreateEmployee = () => {
  const queryClient = useQueryClient();
  const form = useForm<TCreateEmployee>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      role: EUserRole.EMPLOYEE,
      address: "",
    },
  });

  const mutate = useMutation({
    mutationFn: (data: TCreateEmployee) => employeeService.create(data),
    onSuccess: () => {
      toast.success("Employee created successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () => {
      toast.error("Employee creation failed");
    },
  });

  const onSubmit = (data: TCreateEmployee) => {
    mutate.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="size-4" />
          Create Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[80%] !max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-center">Create Employee</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

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
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployee;