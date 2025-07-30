import { FormFieldType } from "@/lib/constants";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Control } from "react-hook-form";
import { Input } from "./ui/input";
import { AsteriskIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectLabel,
} from "./ui/select";

type CustomProps = {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  placeholder?: string;
  label?: string;
  icon?: React.ComponentPropsWithoutRef<typeof AsteriskIcon>;
  disabled?: boolean;
  dateFormat?: string;
  options?: {
    label: string;
    value: string;
  }[];
  courseNames?: {
    name: string;
  }[];
  children?: React.ReactNode;
};

const RenderField = ({
  field,
  props: { fieldType, placeholder, options, courseNames },
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  props: CustomProps;
}) => {
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border">
          <AsteriskIcon className="w-8 text-muted-foreground my-auto" />

          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              className="border-none focus-visible:ring-0 focus-visible:ring-blue-300"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.NUMBER:
      return (
        <div className="flex rounded-md border">
          <AsteriskIcon className="w-8 text-muted-foreground my-auto" />

          <FormControl>
            <Input
              {...field}
              type="number"
              min={0}
              onChange={(e) => field.onChange(Number(e.target.valueAsNumber))}
              placeholder={placeholder}
              className="border-none focus-visible:ring-0 focus-visible:ring-blue-300"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.RADIO:
      return (
        <RadioGroup defaultValue={options?.[0]?.value}>
          {options?.map((option) => (
            <div className="flex items-center space-x-2" key={option.value}>
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    case FormFieldType.TEXTAREA:
      return (
        <Textarea
          placeholder="Type your message here."
          id="message"
          className="my-5"
        />
      );
    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} value={field.value}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Course Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {courseNames?.map((course) => (
                <SelectItem key={course.name} value={course.name || "default"}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    case FormFieldType.FILE:
      return (
        <FormControl>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center w-full">
              <Input
                type="file"
                {...field}
                className="cursor-pointer file:cursor-pointer border-2 border-dashed"
                accept="image/*"
              />
            </div>
            {field.value && (
              <p className="text-sm text-muted-foreground">
                Selected file: {field.value.split("\\").pop()}
              </p>
            )}
          </div>
        </FormControl>
      );
  }
};

export default function CustomForm(props: CustomProps) {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />
          <FormMessage className="text-destructive my-2" />
        </FormItem>
      )}
    />
  );
}
