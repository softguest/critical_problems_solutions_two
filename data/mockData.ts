import { Problem, Category } from '@/types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Technical Issues',
    description: 'Software bugs, system errors, and technical challenges',
    problemCount: 24
  },
  {
    id: '2',
    name: 'Business Strategy',
    description: 'Market analysis, growth strategies, and business decisions',
    problemCount: 18
  },
  {
    id: '3',
    name: 'User Experience',
    description: 'Design problems, usability issues, and user research',
    problemCount: 12
  },
  {
    id: '4',
    name: 'Performance',
    description: 'Optimization challenges and performance bottlenecks',
    problemCount: 15
  }
];

export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Database Performance Degradation in Production',
    content: `# Understanding Database Performance Issues

Database performance degradation is a critical issue that can affect the entire application ecosystem. In our production environment, we've noticed significant slowdowns during peak traffic hours, with query response times increasing from an average of 50ms to over 2 seconds.

## Root Cause Analysis

After extensive monitoring and profiling, we identified several contributing factors:

### 1. Index Optimization
The primary culprit appears to be missing or inefficient database indexes. Our query analysis revealed that several frequently-used queries were performing full table scans instead of utilizing proper indexes.

### 2. Connection Pool Exhaustion
During peak hours, our connection pool was being exhausted, causing new requests to wait for available connections. This created a cascading effect that impacted overall system performance.

### 3. Query Complexity
Some of our newer features introduced complex JOIN operations that weren't properly optimized for our current database schema.

## Impact Assessment

The performance issues have resulted in:
- 40% increase in average response time
- 15% decrease in user engagement
- Increased server costs due to scaling attempts
- Customer complaints about slow loading times

## Proposed Solutions

### Short-term fixes:
1. Add missing indexes for frequently queried columns
2. Increase connection pool size
3. Implement query result caching for static data

### Long-term improvements:
1. Database schema optimization
2. Implementation of read replicas
3. Migration to a more suitable database technology for specific use cases

## Implementation Timeline

We estimate the short-term fixes can be implemented within one week, while the long-term improvements will require 2-3 months of careful planning and execution.

The database performance issue requires immediate attention to prevent further degradation of user experience and potential revenue loss.`,
    excerpt: 'Database performance degradation is affecting our production environment with query response times increasing from 50ms to over 2 seconds during peak hours...',
    category: 'Technical Issues',
    author: 'Sarah Chen',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
    readTime: 8
  },
  {
    id: '2',
    title: 'User Onboarding Conversion Rate Optimization',
    content: `# Improving User Onboarding Experience

Our current user onboarding process has a conversion rate of only 23%, which is significantly below industry standards. This comprehensive analysis explores the issues and proposes actionable solutions.

## Current State Analysis

The onboarding funnel shows significant drop-off points:
- Landing page to signup: 45% conversion
- Signup to email verification: 78% conversion
- Email verification to profile completion: 51% conversion
- Profile completion to first action: 29% conversion

## Key Problems Identified

### 1. Lengthy Registration Process
Our current registration requires 12 fields, including optional ones that users perceive as mandatory. This creates friction and abandonment.

### 2. Unclear Value Proposition
Users don't immediately understand the benefits of completing their profile or taking the first meaningful action in our platform.

### 3. Technical Barriers
The email verification process is unreliable, with some users not receiving verification emails due to spam filters and delivery issues.

## User Research Findings

Through user interviews and surveys, we discovered:
- 67% of users found the registration process too long
- 54% were unsure about what to do after signing up
- 43% experienced technical issues during onboarding

## Proposed Optimization Strategy

### Phase 1: Simplification (Weeks 1-2)
- Reduce registration fields to essential information only
- Implement progressive disclosure for additional details
- Add clear progress indicators

### Phase 2: Value Demonstration (Weeks 3-4)
- Create interactive product tours
- Implement quick wins to show immediate value
- Add social proof and testimonials

### Phase 3: Technical Improvements (Weeks 5-6)
- Improve email deliverability
- Add alternative verification methods
- Implement better error handling and user feedback

## Expected Outcomes

Based on industry benchmarks and our testing, we expect:
- 35% increase in overall conversion rate
- 50% reduction in support tickets related to onboarding
- Improved user satisfaction scores

The optimization of our onboarding process is crucial for sustainable growth and user acquisition efficiency.`,
    excerpt: 'Our user onboarding conversion rate of 23% is below industry standards. Analysis reveals key friction points including lengthy registration and unclear value proposition...',
    category: 'User Experience',
    author: 'Michael Rodriguez',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-15',
    readTime: 6
  },
  {
    id: '3',
    title: 'Scaling Customer Support Operations',
    content: `# Scaling Customer Support for Rapid Growth

As our user base has grown 300% in the past six months, our customer support team is struggling to maintain response times and quality standards.

## Current Challenges

### Volume Management
- Daily ticket volume increased from 50 to 180
- Average response time increased from 2 hours to 8 hours
- Customer satisfaction scores dropped from 4.8 to 3.2

### Resource Constraints
- Support team of 3 handling enterprise-level volume
- Knowledge base outdated and incomplete
- Manual processes consuming 60% of agent time

## Strategic Approach

### 1. Automation Implementation
Deploy chatbots for common queries and automated ticket routing to reduce manual workload and improve response times.

### 2. Self-Service Enhancement
Create comprehensive knowledge base and video tutorials to empower users to solve common issues independently.

### 3. Team Expansion
Hire and train additional support agents with focus on technical expertise and customer empathy.

## Implementation Plan

The scaling plan involves both immediate relief measures and long-term structural improvements to create a sustainable support operation.`,
    excerpt: 'Our customer support team is overwhelmed as daily tickets increased from 50 to 180 following 300% user growth, causing response times to jump from 2 to 8 hours...',
    category: 'Business Strategy',
    author: 'Emily Watson',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-14',
    readTime: 5
  }
];