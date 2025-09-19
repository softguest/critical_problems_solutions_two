import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const GetStarted = () => {
  return (
    <div>
        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
            <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Problem?</h2>
            <p className="text-lg mb-8 opacity-90">
                Join our community of problem solvers and get expert insights on your challenges.
            </p>
            <Button size="lg" variant="secondary" asChild>
                <Link href="/register">Get Started Free</Link>
            </Button>
            </div>
        </section>
    </div>
  )
}

export default GetStarted