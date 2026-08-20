import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const todosTotal = await query('SELECT COUNT(*) FROM todos');
    const todosDone = await query('SELECT COUNT(*) FROM todos WHERE done = true');
    const diaryCount = await query('SELECT COUNT(*) FROM diary_entries');
    const goalsData = await query('SELECT AVG(progress) as avg_progress, COUNT(*) as total FROM goals');
    
    return NextResponse.json({
      todos: { 
        total: parseInt(todosTotal.rows[0].count), 
        done: parseInt(todosDone.rows[0].count) 
      },
      diary: { 
        total: parseInt(diaryCount.rows[0].count) 
      },
      goals: { 
        total: parseInt(goalsData.rows[0].total), 
        avgProgress: Math.round(parseFloat(goalsData.rows[0].avg_progress) || 0) 
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
