import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreationSubmit } from "./SubmitButtons";
import { Card, CardHeader } from "@/components/ui/card";
import { Counter } from "./Counter";

export function SearchModalComponentThree() {
  const [step, setStep] = useState(1);

  function SubmitButtonLocal() {
    if (step === 1) {
      return (
        <Button onClick={() => setStep(step + 1)} type="button">
          Next
        </Button>
      );
    } else if (step === 2) {
      return <CreationSubmit />;
    }
    return null;
  }

  return (
    <div className="rounded-full h-[30px] py-2 px-5 border-[2px] flex items-center cursor-pointer">

      {/* Search Icon - Visible Only on Medium and Larger */}
      <div className="sm:flex ml-14">
        <Dialog>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form className="gap-4 flex flex-col">
              {step === 2 ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Select all the info you need</DialogTitle>
                    <DialogDescription>Provide more details about your preferences.</DialogDescription>
                  </DialogHeader>

                  <Card>
                    <CardHeader className="flex flex-col gap-y-5">
                      {["LivingRooms", "Bathrooms"].map((label, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <h3 className="underline font-medium">{label}</h3>
                            <p className="text-muted-foreground text-sm">
                              How many {label.toLowerCase()} do you have?
                            </p>
                          </div>
                          <Counter name={label.toLowerCase()} />
                        </div>
                      ))}
                    </CardHeader>
                  </Card>
                </>
              ) : null}

              <DialogFooter>
                <SubmitButtonLocal />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}