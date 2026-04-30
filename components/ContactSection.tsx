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

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "a7901fb1-04be-486a-ba13-f9ef92a07dec";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onBlur" });

  const onSubmit = async (data: FormValues) => {
    setStatus("sending");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      });
      const payload = (await res.json().catch(() => null)) as { success?: boolean } | null;
      if (!res.ok || !payload?.success) {
        setStatus("error");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded border border-white/18 bg-[#0a0a0a]/75 px-4 py-3 font-mono text-base text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none transition-colors placeholder:text-zinc-500 focus:border-white/32 focus:bg-[#0a0a0a]/90";

  return (
    <section
      id="contact"
      className="relative z-20 w-full min-w-0 border-t border-border bg-surface px-6 py-28 md:px-12 md:py-36"
    >
      <div className="relative mx-auto w-full min-w-0 max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center font-display text-4xl tracking-[0.22em] text-text-primary md:text-5xl"
        >
          GET IN TOUCH
        </motion.h2>

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
              autoComplete="name"
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
              autoComplete="email"
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
        {status === "error" && (
          <p className="mt-8 text-center font-mono text-xs text-text-secondary" role="alert">
            We couldn&apos;t send that just now. Please try again in a moment.
          </p>
        )}
      </div>
    </section>
  );
}
