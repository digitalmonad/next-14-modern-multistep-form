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
import { useState } from 'react';
import { cn } from '@/lib/utils';
import useWindowSize from 'react-use/lib/useWindowSize';
import { z } from 'zod';
import { motion } from 'framer-motion';

const steps = [
  {
    fields: ['firstName', 'lastName'],
  },
  {
    fields: ['framework'],
  },
  {
    fields: ['email'],
  },
];

type Inputs = z.infer<typeof newsletterFormSchema>;
type FieldName = keyof Inputs;

export const NewsletterForm = () => {
  const [step, setStep] = useState({
    current: 0,
    previous: 0,
  });
  // we need delta to determine way of transition animation
  const delta = step.current - step.previous;

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

  const next = async () => {
    const fields = steps[step.current].fields;
    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: false,
    });

    if (!output) return;

    if (step.current < steps.length - 1) {
      if (step.current === steps.length - 2) {
        await form.handleSubmit(console.log)();
      }

      setStep((prevState) => ({
        previous: prevState.current,
        current: prevState.current + 1,
      }));
    }
  };

  const prev = () => {
    if (step.current > 0) {
      setStep((prevState) => ({
        previous: prevState.current,
        current: prevState.current - 1,
      }));
    }
  };

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
              <div className='flex flex-col space-y-1.5 relative overflow-hidden'>
                {step.current === 0 && (
                  <motion.div
                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='Your first name'
                              {...field}
                              autoFocus
                            />
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
                  </motion.div>
                )}
                {step.current === 1 && (
                  <motion.div
                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
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
                  </motion.div>
                )}
                {step.current === 2 && (
                  <motion.div
                    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
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
                  </motion.div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex flex-col space-y-4 mt-auto'>
        <div className='flex w-full'>
          <Button
            onClick={prev}
            variant='outline'
            className={cn({ hidden: step.current < 1 })}
          >
            Previous
          </Button>

          <Button
            onClick={next}
            variant='outline'
            className={cn('ml-auto', {
              hidden: step.current >= steps.length - 1,
            })}
          >
            Next
          </Button>
        </div>
        <div
          className={cn('flex ml-auto w-full', {
            hidden: step.current !== steps.length - 1,
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
