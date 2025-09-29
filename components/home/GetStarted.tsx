"use client"
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const GetStarted = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Blobs */}
      <style jsx>{`
        .cta-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(32px);
          opacity: 0.5;
          z-index: 0;
        }
        .cta-blob1 {
          background: #60a5fa;
          width: 320px;
          height: 320px;
          top: -80px;
          left: -100px;
          animation: moveBlob1 18s ease-in-out infinite alternate;
        }
        .cta-blob2 {
          background: #818cf8;
          width: 220px;
          height: 220px;
          bottom: -60px;
          right: -60px;
          animation: moveBlob2 22s ease-in-out infinite alternate;
        }
        .cta-blob3 {
          background: #f472b6;
          width: 180px;
          height: 180px;
          top: 40%;
          left: 60%;
          animation: moveBlob3 20s ease-in-out infinite alternate;
        }
        @keyframes moveBlob1 {
          0% { transform: translate(0, 0) scale(1);}
          100% { transform: translate(60px, 40px) scale(1.1);}
        }
        @keyframes moveBlob2 {
          0% { transform: translate(0, 0) scale(1);}
          100% { transform: translate(-40px, 30px) scale(1.15);}
        }
        @keyframes moveBlob3 {
          0% { transform: translate(0, 0) scale(1);}
          100% { transform: translate(30px, -30px) scale(1.08);}
        }
      `}</style>
      <div className="cta-blob cta-blob1" />
      <div className="cta-blob cta-blob2" />
      <div className="cta-blob cta-blob3" />

      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-blue-500 text-primary-foreground rounded-3xl shadow-2xl mx-auto max-w-4xl my-12">
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Ready to Share Your Problem?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 font-medium">
            Join our community of problem solvers and get expert insights on your challenges.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg font-semibold shadow-lg">
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default GetStarted