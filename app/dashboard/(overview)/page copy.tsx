import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { 
  fetchRevenue, fetchLatestInvoices, fetchCardData
} from '@/app/lib/data';
import pool from '@/app/lib/db';
// import { Globe } from "@/components/magicui/globe";
import { AnimatedList } from "@/components/magicui/animated-list";
import { cn } from "@/app/lib/utils";
interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  // {
  //   name: "Payment received",
  //   description: "Magic UI",
  //   time: "15m ago",
 
  //   icon: "💸",
  //   color: "#00C9A7",
  // },
  // {
  //   name: "User signed up",
  //   description: "Magic UI",
  //   time: "10m ago",
  //   icon: "👤",
  //   color: "#FFB800",
  // },
  // {
  //   name: "New message",
  //   description: "Magic UI",
  //   time: "5m ago",
  //   icon: "💬",
  //   color: "#FF3D71",
  // },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
];
 
notifications = Array.from({ length: 10 }, () => notifications).flat();
 
const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};


export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const { totalPaidInvoices, totalPendingInvoices, numberOfInvoices, numberOfCustomers } = await fetchCardData();
  let data = [];
  try {
    const [rows] = await pool.query('SELECT * FROM cmf_wxbot_babyfood');
    data = rows.map((row: any) => {
      return (
        <div key={row.id} className="p-4 border rounded mb-2">
          <h3 className="font-bold">{row.title}</h3>
          <p className="text-gray-600">{row.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>信息: {row.msg}</span>
            <span className="ml-4">发送时间: {row.send_time instanceof Date ? row.send_time.toLocaleString() : row.send_time}</span>
          </div>
        </div>
      )
    });
    console.log(rows);
  } catch (error) {
    console.error(error);
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        仪表板
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="已收款" value={totalPaidInvoices} type="collected" />
        <Card title="待处理" value={totalPendingInvoices} type="pending" />
        <Card title="总发票数" value={numberOfInvoices} type="invoices" />
        <Card
          title="总客户数"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue}  />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {data.map((item) => (
          <div 
            key={item.key} 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {item}
          </div>
        ))}
      </div>
       <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden p-2",
      )}
    >
      {/* <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList> */}
      {/* <Notification name="New event" description="Magic UI" time="2m ago" icon="🗞️" color="#1E86FF" /> */}
 
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
    </main>
  );
}