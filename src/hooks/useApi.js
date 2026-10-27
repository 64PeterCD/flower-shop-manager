import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../api/client.js'

// Gọi API khi trang mở (và mỗi khi `deps` đổi), trả về { data, loading, error, status, reload }.
// `fetcher` là hàm trả Promise, ví dụ () => getProducts({ category }).
// `status` là mã HTTP khi lỗi (404, 500...) để trang quyết định hiện "không tìm thấy" hay báo lỗi.
export default function useApi(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null, status: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let ignore = false // bỏ kết quả cũ nếu trang đã đổi sang request khác
    setState((current) => ({ ...current, loading: true, error: null, status: null }))
    fetcher()
      .then((data) => !ignore && setState({ data, loading: false, error: null, status: null }))
      .catch(
        (error) =>
          !ignore &&
          setState({ data: null, loading: false, error: getErrorMessage(error), status: error.response?.status ?? null }),
      )
    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version])

  const reload = useCallback(() => setVersion((value) => value + 1), [])
  return { ...state, reload }
}
