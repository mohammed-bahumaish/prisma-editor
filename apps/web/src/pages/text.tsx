import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form/form";
import { TextInputField } from "~/components/ui/form/text-input-field";

export default function Home() {
  return (
    <Form
      onSubmit={(vals) => {
        console.log(vals);
      }}
      schema={z.object({ test: z.number() })}
    >
      <TextInputField name="test" />
      <Button type="submit">ok</Button>
    </Form>
  );
}
