import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreationSubmit } from "./SubmitButtons";
import { Card, CardHeader } from "@/components/ui/card";
import { Counter } from "./Counter";

export function SearchModalComponentTwo() {
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
    <div className="rounded-full py-2 px-5 border-0 sm:border flex items-center cursor-pointer">
      {/* Menu Links - Hidden on Mobile, Visible on Medium and Large */}
      <div className="hidden sm:flex gap-3 font-medium transition-colors duration-300">
        {["Home", "Discover", "About", "Contact", "Settings"].map((label, idx) => (
          <a
            key={idx}
            href="#"
            className="text-black hover:text-gray-600" // Always black text
          >
            {label}
          </a>
        ))}
      </div>

      {/* Search Icon - Visible Only on Medium and Larger */}
      <div className="sm:flex ml-14">
        <Dialog>
          <DialogTrigger asChild>
            <Search
              className="bg-primary text-white p-1 h-8 hover:bg-hover hover:text-white w-8 rounded-full" // Always black text
            />
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