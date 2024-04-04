'use client';

import Confetti from 'react-confetti';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  NewsletterFormSchema,
  newsletterFormSchema,
  FrameworksSchema,
} from '@/schemas/newsletterSchemas';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import useWindowSize from 'react-use/lib/useWindowSize';

export const NewsletterForm = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { width, height } = useWindowSize();

  const form = useForm<NewsletterFormSchema>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      framework: undefined,
    },
  });

  function onSubmit(values: NewsletterFormSchema) {
    // ✅ Async logic....
    setSubmitted(true);
    console.log(values);
  }

  const steps = useMemo(
    () => [
      {
        markup: (
          <div key={1}>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder='Your first name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder='Your last name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ),
        validate: ['firstName'],
      },
      {
        markup: (
          <div key={2}>
            <FormField
              control={form.control}
              name='framework'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your preferred JS framework</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select framework' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FrameworksSchema.options.map((framework) => (
                        <SelectItem key={framework} value={framework}>
                          {framework}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ),
        validate: ['framework'],
      },
      {
        markup: (
          <div key={3}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your email</FormLabel>
                  <FormControl>
                    <Input placeholder='Your email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ),
        validate: ['email'],
      },
    ],
    []
  );

  if (submitted)
    return (
      <>
        <Confetti
          {...{ run: submitted }}
          width={width}
          height={height}
          recycle={false}
        />
        <h1 className='text-3xl font-extrabold'>Thank you!</h1>
      </>
    );

  return (
    <Card className='w-[350px] flex flex-col'>
      <CardHeader>
        <CardTitle>Be the first to know!</CardTitle>
        <CardDescription>
          Sign up for our emails to be the one of the first to receive news and
          exclusive content
        </CardDescription>
      </CardHeader>
      <CardContent className='min-h-[200px]'>
        <Form {...form}>
          <form className='space-y-8'>
            <div className='grid w-full items-center gap-4'>
              <div className='flex flex-col space-y-1.5 relative overflow-x-hidden'>
                {steps[step].markup}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex flex-col space-y-4 mt-auto'>
        <div className='flex w-full'>
          <Button
            onClick={() => setStep((prevStep) => prevStep - 1)}
            variant='outline'
            className={cn({ hidden: step < 1 })}
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              if (steps[step].validate) {
                const validatedFields = steps[step].validate.map((field) =>
                  // @ts-ignore
                  form.trigger(field)
                );

                Promise.all(validatedFields).then((results) => {
                  if (results.every((result) => result === true)) {
                    setStep((prevStep) => prevStep + 1);
                  } else {
                    console.log('Some fields are invalid');
                  }
                });
              } else {
                setStep((prevStep) => prevStep + 1);
              }
            }}
            variant='outline'
            className={cn('ml-auto', { hidden: step >= steps.length - 1 })}
          >
            Next
          </Button>
        </div>
        <div
          className={cn('flex ml-auto w-full', {
            hidden: step !== steps.length - 1,
          })}
        >
          <Button
            variant='secondary'
            className='w-full'
            onClick={form.handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
