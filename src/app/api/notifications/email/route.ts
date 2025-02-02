// src/app/api/notifications/email/route.ts
import { transporter } from '@/utils/emailConfig'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

    const { postTitle, postContent, postId } = await request.json()

    // ดึงรายชื่อ users ที่ต้องการรับ email
    const { data: users } = await supabase
      .from('users')
      .select('email, id')
    
    if (!users) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 })
    }

    // สร้าง email template
    const emailTemplate = {
      from: process.env.EMAIL_USER,
      subject: `New Blog Post: ${postTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>มีบทความใหม่: ${postTitle}</h2>
          <p>${postContent.substring(0, 200)}...</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/posts/${postId}" 
             style="background: #0070f3; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px;">
            อ่านเพิ่มเติม
          </a>
        </div>
      `
    }

    // ส่ง email ให้แต่ละ user
    for (const user of users) {
      try {
        await transporter.sendMail({
          ...emailTemplate,
          to: user.email
        })

        // บันทึก log การส่ง email สำเร็จ
        await supabase
          .from('email_logs')
          .insert({
            user_id: user.id,
            post_id: postId,
            status: 'sent'
          })

      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error)
        
        // บันทึก log กรณีส่ง email ไม่สำเร็จ
        await supabase
          .from('email_logs')
          .insert({
            user_id: user.id,
            post_id: postId,
            status: 'failed',
            // error: error.message
          })
      }
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Email notification error:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}