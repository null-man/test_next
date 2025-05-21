import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { 
  fetchRevenue, fetchLatestInvoices, fetchCardData
} from '@/app/lib/data';
import pool from '@/app/lib/db';

export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();
  const { totalPaidInvoices, totalPendingInvoices, numberOfInvoices, numberOfCustomers } = await fetchCardData();
  
  let babyFoodData: any[] = []; // Renamed variable to store raw data
  try {
    const [rows] = await pool.query('SELECT * FROM cmf_wxbot_babyfood');
    // Ensure 'rows' is an array. Type assertion might be needed if 'rows' type is complex.
    if (Array.isArray(rows)) {
      babyFoodData = rows;
    } else {
      // Handle cases where rows might not be an array as expected, e.g., log a warning.
      console.warn("Database query did not return an array for baby food data.");
      babyFoodData = []; // Default to empty array to prevent map errors
    }
    // console.log(babyFoodData); // Now logs the data that will be mapped
  } catch (error) {
    console.error('Failed to fetch baby food data:', error);
    babyFoodData = []; // Ensure it's an array in case of error
  }

  return (
    <main>
      
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
        {babyFoodData.map((row: any) => (
          <div
            key={row.id} // Use a unique id from the row data for the key
            // Combined classNames from the previous outer and inner divs.
            // Removed mb-2 to rely on grid gap. Added rounded-lg and shadow for potentially better aesthetics.
            className="cursor-pointer hover:bg-gray-100 transition-colors p-4 border rounded-lg shadow-md"
          >
            <h3 className="font-bold text-md mb-1">{row.title}</h3>
            {/* Added whitespace-pre-wrap to preserve newlines and spaces in the content */}
            <p className="text-gray-700 text-sm whitespace-pre-wrap mb-2">{row.content}</p>
            <div className="mt-1 text-xs text-gray-500">
              <p>{row.msg}</p>
              <p className="mt-1">
                发送时间: {row.send_time instanceof Date ? row.send_time.toLocaleString() : String(row.send_time)}
              </p>
            </div>
          </div>
        ))}
      </div>
     
    </main>
  );
}