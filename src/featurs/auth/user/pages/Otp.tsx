import { UserUrls } from "@/@types/urlEnums/UserUrls";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useVerifyMutation } from "@/services/apis/UserApis";
import { otpFormSchema } from "../zodeSchema/authSchema";
import { errorTost } from "@/components/ui/tosastMessage";
import { IaxiosResponse } from "../@types/IaxiosResponse";






function Otp() {

    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(59);
    const [ resendTimer , setresendTimer ] = useState<boolean>(true)
    const navigate = useNavigate()
    const location = useLocation();
    const { email, name } = location.state;
    const [ verifyOtp ]    = useVerifyMutation()
    
    const form = useForm<z.infer<typeof otpFormSchema>>({
        resolver: zodResolver(otpFormSchema),
        mode: "onChange", // Enable real-time validation
        defaultValues: {
            otpOne: "",
            otpTwo: "",
            otpThree: "",
            otpFour: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof otpFormSchema>) => {
        const otp = data.otpOne + data.otpTwo + data.otpThree + data.otpFour;
        const response: IaxiosResponse = await verifyOtp({otp , email} );        
        if( response.data ){
            navigate(UserUrls.home)
        }else{            
            errorTost("Incorrect OTP "  , response.error.data.message)
        }
    };

    // Check if there are any errors
    const hasErrors = !!Object.keys(form.formState.errors).length;

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds == 0) {
                if (minutes == 0) {
                    clearInterval(interval);
                   
                } else {
                    setSeconds(59);
                    setMinutes(minutes - 1)
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    },);



    const handilResendOtp = ()=>{
        setresendTimer(false)
        toast({
            title:"Resented Otp to your email",
            description:"check you email for the new otp and verify it",
            className: "text-green-700 border bg-gray-200 mb-6",
        })
        setTimeout(()=> setresendTimer(true),100000)

    }
    return (
        <div className="dark:bg-zinc-800 min-h-screen">
            <div className="w-full">
                <div className="w-full flex justify-between items-center pt-12 px-[2rem]">
                    <Link to={UserUrls.home} className="flex items-center group">
                        <div className="relative w-5 h-5 items-start">
                            <ChevronLeft className="absolute transition-transform duration-300 opacity-100 group-hover:opacity-0 w-full h-full" strokeWidth={2.5} />
                            <ArrowLeft className="absolute transition-transform duration-300 opacity-0 group-hover:opacity-100 w-full h-full" />
                        </div>
                        <span className="ml-1 font-cabinet text-sm">BACK</span>
                    </Link>

                    <Link to={UserUrls.signIn}>
                        <span className="font-cabinet font-semibold text-xs relative group">
                            SIGN IN
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-black dark:bg-zinc-300 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                    </Link>
                </div>
            </div>
            <div className="w-full my-[2rem] flex flex-col items-center justify-center">
                <div className="w-2/5">
                    <div className="w-full flex flex-col items-center mt-[5rem]">
                        <p className="text-2xl font-semibold font-supreme">VERIFY YOUR OTP</p>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center mt-[2rem]">
                        <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium">
                            We've sent a code to your email. Please enter it below.
                        </p>
                    </div>

                    <div className="w-full flex flex-row justify-center items-center mt-5">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* OTP Fields */}
                                <div className="flex gap-2 justify-center">
                                    {["otpOne", "otpTwo", "otpThree", "otpFour"].map((otpField) => (
                                        <FormField
                                            key={otpField}
                                            control={form.control}
                                            name={otpField as keyof z.infer<typeof otpFormSchema>}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            className="w-14 h-12 text-center border border-zinc-950 mx-2"
                                                            maxLength={1}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>

                                {/* Error Message */}
                                {hasErrors && (
                                    <p className="text-red-500 text-center mt-2">
                                        All fields must be single digits (0-9).
                                    </p>
                                )}

                                <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium flex justify-center">
                                    OTP will expired : <span className="text-black dark:text-zinc-700">{minutes < 10 ? `0${minutes}` : minutes}:
                                        {seconds < 10 ? `0${seconds}` : seconds}</span>
                                </p>
                                <p className="text-zinc-600 dark:text-zinc-400 font-cabinet text-xs font-medium">
                                    Did't receved code ?  <span
                                    
                                        className={`font-cabinet font-semibold text-xs relative group ${ resendTimer ? 'text-black dark:text-zinc-300 cursor-pointer' : 'text-zinc-300  dark:text-zinc-900 cursor-not-allowed '} `}
                                        onClick={() => resendTimer && handilResendOtp()} >
                                        Resend
                                        <span className={`absolute bottom-0 left-0 w-0 h-[2px] ${ resendTimer && 'bg-black dark:bg-zinc-500'} transition-all duration-300 group-hover:w-full`}></span>
                                    </span>
                                </p>

                                {/* Submit Button */}
                                <Button
                                    type={form.formState.isValid ? "submit" : "button"}
                                    className={`font-cabinet w-full rounded-none transition-all duration-200 ${!form.formState.isValid ? "bg-zinc-400 cursor-not-allowed" : ""
                                        }`}
                                    disabled={!form.formState.isValid}
                                >
                                    Verify
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Otp;
