import useSWR from 'swr'

function fetcher(url) {
  return window.fetch(url).then((res) => res.json())
}

export function getPIPData(id){
  return useSWR(`/api/get-pip-data?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function usePIPEntries(ffid, filter){
  try{
    if (filter == "ALL"){
      const { data, error } = useSWR(`/api/get-pip`, fetcher, { refreshInterval: 1000})
      const { data: getDataCount } = useSWR(`/api/get-pip-data-count?ffid=${ffid}`, fetcher, { refreshInterval: 1000 })

      return {
        entries: data,
        entryCount: getDataCount,
        isLoading: !error && (!data || !getDataCount),
        isError: error
      }
    }
    else if (filter == "SUBMITTED"){
      const { data, error } = useSWR(`/api/get-pip-submitted?ffid=${ffid}`, fetcher, { refreshInterval: 1000})
      const { data: getDataCount } = useSWR(`/api/get-pip-data-count?ffid=${ffid}`, fetcher, { refreshInterval: 1000 })

      return {
        entries: data,
        entryCount: getDataCount,
        isLoading: !error && (!data || !getDataCount),
        isError: error
      }
    }
    else if (filter = "ASSIGNED"){
      const { data, error } = useSWR(`/api/get-pip-assigned?ffid=${ffid}`, fetcher, { refreshInterval: 1000})
      const { data: getDataCount } = useSWR(`/api/get-pip-data-count?ffid=${ffid}`, fetcher, { refreshInterval: 1000 })

      return {
        entries: data,
        entryCount: getDataCount,
        isLoading: !error && (!data || !getDataCount),
        isError: error
      }
    }
    else{
      const { data, error } = useSWR(`/api/get-pip-submitted?ffid=${ffid}`, fetcher, { refreshInterval: 1000})
      const { data: getDataCount } = useSWR(`/api/get-pip-data-count?ffid=${ffid}`, fetcher, { refreshInterval: 1000 })

      return {
        entries: data,
        entryCount: getDataCount,
        isLoading: !error && (!data || !getDataCount),
        isError: error
      }
    }
  }
  catch(err){
    console.log(err)
  }
}

export function getPIPGoals(id){
  return useSWR(`/api/get-pip-goals?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function getFirstPIPGoalCount(id){
  return useSWR(`/api/get-first-pip-goal-count?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function getCAPAFirstPeriod(id){
  return useSWR(`/api/get-first-period-capa?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function getCAPASecondPeriod(id){
  return useSWR(`/api/get-second-period-capa?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function getCAPAThirdPeriod(id){
  return useSWR(`/api/get-third-period-capa?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function getUploadsFirstPeriod(id){
  return useSWR(`/api/get-first-period-uploads?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function getUploadsSecondPeriod(id){
  return useSWR(`/api/get-second-period-uploads?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function getUploadsThirdPeriod(id){
  return useSWR(`/api/get-third-period-uploads?id=${id}`, fetcher, { refreshInterval: 1000})
}

export function getUploadsSummary(id){
  return useSWR(`/api/get-summary-uploads?id=${id}`, fetcher, { refreshInterval: 1000})
}

// export function usePIPEntries(){
//      const { data: entries, error } =  useSWR(`/api/get-pip`, fetcher, { refreshInterval: 1000 })
//      return {
//       entries: entries,
//       isLoading: !error && !entries,
//       isError: error,

//      }
// }


