"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onBlur" });

  const onSubmit = async (data: FormValues) => {
    setStatus("sending");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        throw new Error(payload.error || `Request failed (${res.status})`);
      }
      setStatus("success");
      reset();
    } catch (e) {
      setStatus("error");
      setErrorMessage(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  const inputClass =
    "w-full rounded border border-border bg-surface/80 px-4 py-3 font-mono text-xs text-text-primary outline-none transition-colors placeholder:text-text-secondary/60 focus:border-accent/60 focus:shadow-glow-sm";

  return (
    <section
      id="contact"
      className="relative z-20 border-t border-border bg-surface px-6 py-28 md:px-12 md:py-36"
    >
      <div className="relative mx-auto max-w-xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-display text-4xl tracking-[0.22em] text-text-primary md:text-5xl"
        >
          GET IN TOUCH
        </motion.h2>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-text-secondary">
          Messages are sent to{" "}
          <a
            href="mailto:lucas@goluda.ai"
            className="text-accent/90 underline-offset-4 hover:underline"
          >
            lucas@goluda.ai
          </a>{" "}
          via Resend.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-14 space-y-5"
          noValidate
        >
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              id="name"
              className={inputClass}
              placeholder="Name"
              data-cursor-hover
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 font-mono text-[10px] text-red-300/90">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputClass}
              placeholder="Email"
              data-cursor-hover
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 font-mono text-[10px] text-red-300/90">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="subject" className="sr-only">
              Subject
            </label>
            <input
              id="subject"
              className={inputClass}
              placeholder="Subject"
              data-cursor-hover
              {...register("subject", { required: "Subject is required" })}
            />
            {errors.subject && (
              <p className="mt-1 font-mono text-[10px] text-red-300/90">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className={`${inputClass} min-h-[140px] resize-y`}
              placeholder="Message"
              data-cursor-hover
              {...register("message", { required: "Message is required" })}
            />
            {errors.message && (
              <p className="mt-1 font-mono text-[10px] text-red-300/90">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="group relative mt-2 w-full overflow-hidden rounded border border-accent/50 bg-bg/90 py-4 font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-all hover:shadow-glow disabled:opacity-50"
            data-cursor-hover
          >
            <span className="relative z-10">
              {status === "sending" ? "Sending…" : "Send message"}
            </span>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </form>

        {status === "success" && (
          <p
            className="mt-8 text-center font-mono text-xs text-accent"
            role="status"
          >
            Message sent. I&apos;ll be in touch.
          </p>
        )}
        {status === "error" && errorMessage && (
          <p className="mt-8 text-center font-mono text-xs text-red-300/90" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
