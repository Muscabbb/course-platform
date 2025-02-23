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
  children?: React.ReactNode;
};

const RenderField = ({
  field,
  props: { fieldType, placeholder, options },
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
    case FormFieldType.FILE:
      return (
        <div className="flex rounded-md border">
          <AsteriskIcon className="w-8 text-muted-foreground my-auto" />
          <FormControl>
            <Input
              type="file"
              {...field}
              placeholder={placeholder}
              className="border-none outline-none focus-visible:ring-0 focus-visible:ring-blue-300"
            />
          </FormControl>
        </div>
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
        <FormItem className="flex-1 my-4">
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
