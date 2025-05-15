import { BellIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default async function Page() {
  // 使用服务器端获取数据
  const res = await fetch('https://msrms.com/api/index/notify/towx3', { cache: 'no-store' });
  // 添加3秒延迟以确保API有足够时间响应
  await new Promise(resolve => setTimeout(resolve, 3000));
  // 打印响应对象
  console.log('API响应:', res);
  // 检查响应状态
  if (!res.ok) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">获取数据失败，请稍后再试</p>
        </div>
      </div>
    );
  }
  
  // 解析数据
  const data = await res.json();
  
  // 获取当前日期并格式化
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}年${month}月${day}日`;
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <BellIcon className="h-8 w-8 mr-2 text-blue-600" />
          今日通知
        </h1>
        <div className="text-sm text-gray-500">
          {formattedDate}
        </div>
      </div>
      
      {data ? (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {Array.isArray(data) ? (
            data.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {data.map((item, index) => (
                  <li key={index} className="py-4 hover:bg-blue-50 transition-colors rounded-md px-3">
                    <div className="flex items-start">
                      <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item.title || `通知 #${index + 1}`}
                        </p>
                        <p className="text-gray-600 mt-1 text-sm">
                          {item.content || JSON.stringify(item)}
                        </p>
                        {item.time && (
                          <p className="text-xs text-gray-400 mt-2">
                            {item.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <BellIcon className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg">今日没有通知</p>
                <p className="text-sm mt-2">有新消息时会在这里显示</p>
              </div>
            )
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">原始数据:</p>
              <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
            <div className="h-4 w-24 bg-blue-200 rounded"></div>
            <p className="mt-4 text-blue-500">加载中...</p>
          </div>
        </div>
      )}
    </div>
  );
}