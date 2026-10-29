'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { ListingCard } from './listing-card'
import { useApprovedListings } from '@/hooks/use-approved-listings'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Reveal, PageHero, services } from './site'
import { useBranding } from '@/hooks/use-branding'

export function HomePage() {
  const { heroBgUrl } = useBranding()
  const { listings, loading } = useApprovedListings()
  const featuredListings = listings.slice(0, 6)

  return <>
    <section className="hero" style={{ '--hero-image': `url(${heroBgUrl})` } as React.CSSProperties}>
      <div className="hero-content"><span className="eyebrow">PREMIUM REAL ESTATE · SOUTH AFRICA</span><h1>Where opportunity meets <em>prime property.</em></h1><p>NQ Kazi Investments helps individuals, families and businesses acquire, lease and grow premium residential, commercial and industrial property nationwide.</p><div className="actions"><Link className="button red" href="/listings">Browse listings <ArrowRight /></Link><Link className="button outline" href="/contact">Book a consultation</Link></div></div>
      <div className="stats"><b>9 <small>PROVINCES<br />COVERED</small></b><b>3 <small>PROPERTY<br />SECTORS</small></b><b>1:1 <small>PERSONAL<br />SERVICE</small></b></div>
    </section>
    <Reveal className="section"><div className="section-heading"><span className="eyebrow">WHAT WE DO</span><h2>A complete real estate partner</h2><p>From your first home to your next industrial portfolio acquisition — one trusted team across South Africa.</p></div><div className="cards">{services.map(([title, text, Icon]) => <article className="card" key={title}><div className="icon-box"><Icon /></div><h3>{title}</h3><p>{text}</p><Link href="/services">Learn more <ArrowRight /></Link></article>)}</div></Reveal>
    <section className="section split"><div className="split-image" /><div><span className="eyebrow">ABOUT NQ KAZI</span><h2>South African property, handled with precision.</h2><p>We are a national real estate firm serving buyers, families, investors and SMMEs. Our team combines on-the-ground market knowledge with disciplined investment thinking to deliver outcomes that compound over time.</p><ul className="checks"><li>Residential</li><li>Commercial</li><li>Industrial</li><li>Investment</li></ul><Link className="button olive" href="/about">About us <ArrowRight /></Link></div></section>
    <section className="section featured"><div className="section-heading"><span className="eyebrow">FEATURED</span><h2>Hand-picked properties</h2><p>A glimpse of what&apos;s currently moving in our portfolio.</p><Link href="/listings">View all listings →</Link></div>{loading ? <div className="property-grid" aria-label="Loading listings"><div className="listing-skeleton" /><div className="listing-skeleton" /><div className="listing-skeleton" /></div> : featuredListings.length ? <div className="property-grid">{featuredListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div> : <p>No listings available right now.</p>}</section>
    <EnquiryForm source="home" />
  </>
}

export function EnquiryForm({source}:{source:string}){const [sent,setSent]=useState(false); const [loading,setLoading]=useState(false); async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);const data=Object.fromEntries(new FormData(e.currentTarget));try { await addDoc(collection(db, 'enquiries'), { ...data, source, createdAt: serverTimestamp() }); setSent(true) } catch (error) { console.error('Unable to send enquiry:', error); window.alert("Sorry, we couldn't send your message. Please WhatsApp or call 083 422 4505.") } finally { setLoading(false) }} return <section className="section contact"><div><span className="eyebrow">GET IN TOUCH</span><h2>Let&apos;s talk about your next move.</h2><p>Whether you&apos;re buying your first home or expanding a commercial portfolio, our team is ready to help.</p></div><form className="form-card form-grid" onSubmit={submit}>{['name','email','phone'].map(n=><label className="field" key={n}>{n.toUpperCase()}<input name={n} required={n!=='phone'} type={n==='email'?'email':'text'}/></label>)}<label className="field full">MESSAGE<textarea name="message" required/></label><button className="button olive" disabled={loading}>{sent?'Thank you, we\'ll be in touch soon.':loading?'Sending…':'Send enquiry'} <ArrowRight/></button></form></section>}
export function GenericPage({kind,title,text}:{kind:string,title:string,text:string}){return <><PageHero eyebrow={kind.toUpperCase()} title={title} text={text}/><section className="section"><div className="section-heading"><h2>Guidance built around your next move.</h2><p>Our team brings market knowledge, clear communication and thoughtful execution to every brief.</p></div><div className="cards">{services.slice(0,3).map(([t,d,Icon])=><article className="card" key={t}><div className="icon-box"><Icon/></div><h3>{t}</h3><p>{d}</p><Link href="/contact">Enquire <ArrowRight/></Link></article>)}</div></section><EnquiryForm source={kind.toLowerCase()}/></>}
