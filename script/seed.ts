// scripts/seed-database.ts
import { createClient } from '@supabase/supabase-js';
import { users, customers, invoices, revenue } from '../app/lib/placeholder-data';

// Supabase 连接信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // 使用 service role key 以获得完整权限

async function main() {
  console.log('开始数据填充...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // 清空现有表（可选）
  console.log('清空现有表...');
  await supabase.from('invoices').delete().neq('id', 0);
  await supabase.from('customers').delete().neq('id', 0);
  await supabase.from('users').delete().neq('id', 0);
  await supabase.from('revenue').delete().neq('id', 0);
  
  // 插入用户数据
  console.log('插入用户数据...');
  const { error: usersError } = await supabase.from('users').insert(users);
  if (usersError) console.error('用户数据插入失败:', usersError);
  
  // 插入客户数据
  console.log('插入客户数据...');
  const { error: customersError } = await supabase.from('customers').insert(customers);
  if (customersError) console.error('客户数据插入失败:', customersError);
  
  // 插入发票数据
  console.log('插入发票数据...');
  const { error: invoicesError } = await supabase.from('invoices').insert(
    invoices.map((invoice, index) => ({ id: `invoice-${index + 1}`, ...invoice }))
  );
  if (invoicesError) console.error('发票数据插入失败:', invoicesError);
  
  // 插入收入数据
  console.log('插入收入数据...');
  const { error: revenueError } = await supabase.from('revenue').insert(
    revenue.map((item, index) => ({ id: index + 1, ...item }))
  );
  if (revenueError) console.error('收入数据插入失败:', revenueError);
  
  console.log('数据填充完成!');
}

main().catch(err => {
  console.error('种子脚本执行失败:', err);
  process.exit(1);
});