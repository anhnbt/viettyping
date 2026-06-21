import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { subjects } from '../data/subjects';

// Đọc env thủ công từ .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      value = value.replace(/^"|"\s*$/g, '');
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Lỗi: Thiếu Supabase URL hoặc KEY trong file .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Bắt đầu di chuyển dữ liệu môn học lên Supabase...');
  
  for (const subject of subjects) {
    console.log(`- Đang xử lý môn: ${subject.name} (${subject.id})`);
    
    // 1. Chèn subject
    const { error: subjectErr } = await supabase
      .from('subjects')
      .upsert({
        id: subject.id,
        name: subject.name,
        description: subject.description,
        icon: subject.icon,
        color: subject.color,
        grade: subject.grade,
        thumbnail_url: subject.thumbnailUrl,
        updated_at: new Date().toISOString()
      });
      
    if (subjectErr) {
      console.error(`Lỗi khi insert subject ${subject.id}:`, subjectErr);
      continue;
    }

    // 2. Chèn các topics
    let topicSortOrder = 0;
    for (const topic of subject.topics) {
      topicSortOrder++;
      const { error: topicErr } = await supabase
        .from('topics')
        .upsert({
          id: topic.id,
          subject_id: subject.id,
          title: topic.title,
          description: topic.description,
          difficulty: topic.difficulty,
          estimated_time: topic.estimatedTime,
          content: topic.content,
          sort_order: topicSortOrder,
          updated_at: new Date().toISOString()
        });

      if (topicErr) {
        console.error(`Lỗi khi insert topic ${topic.id}:`, topicErr);
        continue;
      }

      // 3. Chèn các activities
      let activitySortOrder = 0;
      for (const activity of topic.activities) {
        activitySortOrder++;
        const { error: activityErr } = await supabase
          .from('activities')
          .upsert({
            id: activity.id,
            topic_id: topic.id,
            type: activity.type,
            title: activity.title,
            content: activity.content,
            instructions: activity.instructions,
            target_score: activity.targetScore || null,
            time_limit: activity.timeLimit || null,
            options: activity.options || null,
            correct_answer: activity.correctAnswer || null,
            image_url: activity.imageUrl || null,
            data: activity.data || null,
            sort_order: activitySortOrder,
            updated_at: new Date().toISOString()
          });

        if (activityErr) {
          console.error(`Lỗi khi insert activity ${activity.id}:`, activityErr);
        }
      }
    }
  }

  console.log('Hoàn thành di chuyển dữ liệu môn học!');
}

seed();
