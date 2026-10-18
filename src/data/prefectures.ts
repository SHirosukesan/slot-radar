export type Region = '北海道' | '東北' | '関東' | '中部' | '近畿' | '中国' | '四国' | '九州・沖縄'

export type Prefecture = {
  /** JIS X 0401 都道府県コード（1〜47） */
  code: number
  name: string
  region: Region
  /** 県庁所在地のおおよその座標。基本地域の「基準地点」に使う（距離計算用の目安） */
  lat: number
  lng: number
}

export const REGIONS: readonly Region[] = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄']

export const PREFECTURES: readonly Prefecture[] = [
  { code: 1, name: '北海道', region: '北海道', lat: 43.064, lng: 141.347 },
  { code: 2, name: '青森県', region: '東北', lat: 40.824, lng: 140.74 },
  { code: 3, name: '岩手県', region: '東北', lat: 39.704, lng: 141.153 },
  { code: 4, name: '宮城県', region: '東北', lat: 38.269, lng: 140.872 },
  { code: 5, name: '秋田県', region: '東北', lat: 39.719, lng: 140.102 },
  { code: 6, name: '山形県', region: '東北', lat: 38.24, lng: 140.364 },
  { code: 7, name: '福島県', region: '東北', lat: 37.75, lng: 140.468 },
  { code: 8, name: '茨城県', region: '関東', lat: 36.342, lng: 140.447 },
  { code: 9, name: '栃木県', region: '関東', lat: 36.566, lng: 139.884 },
  { code: 10, name: '群馬県', region: '関東', lat: 36.391, lng: 139.061 },
  { code: 11, name: '埼玉県', region: '関東', lat: 35.857, lng: 139.649 },
  { code: 12, name: '千葉県', region: '関東', lat: 35.605, lng: 140.123 },
  { code: 13, name: '東京都', region: '関東', lat: 35.69, lng: 139.692 },
  { code: 14, name: '神奈川県', region: '関東', lat: 35.448, lng: 139.642 },
  { code: 15, name: '新潟県', region: '中部', lat: 37.902, lng: 139.023 },
  { code: 16, name: '富山県', region: '中部', lat: 36.695, lng: 137.211 },
  { code: 17, name: '石川県', region: '中部', lat: 36.594, lng: 136.626 },
  { code: 18, name: '福井県', region: '中部', lat: 36.065, lng: 136.222 },
  { code: 19, name: '山梨県', region: '中部', lat: 35.664, lng: 138.568 },
  { code: 20, name: '長野県', region: '中部', lat: 36.651, lng: 138.181 },
  { code: 21, name: '岐阜県', region: '中部', lat: 35.391, lng: 136.722 },
  { code: 22, name: '静岡県', region: '中部', lat: 34.977, lng: 138.383 },
  { code: 23, name: '愛知県', region: '中部', lat: 35.18, lng: 136.907 },
  { code: 24, name: '三重県', region: '近畿', lat: 34.73, lng: 136.509 },
  { code: 25, name: '滋賀県', region: '近畿', lat: 35.004, lng: 135.869 },
  { code: 26, name: '京都府', region: '近畿', lat: 35.021, lng: 135.756 },
  { code: 27, name: '大阪府', region: '近畿', lat: 34.686, lng: 135.52 },
  { code: 28, name: '兵庫県', region: '近畿', lat: 34.691, lng: 135.183 },
  { code: 29, name: '奈良県', region: '近畿', lat: 34.685, lng: 135.833 },
  { code: 30, name: '和歌山県', region: '近畿', lat: 34.226, lng: 135.168 },
  { code: 31, name: '鳥取県', region: '中国', lat: 35.504, lng: 134.238 },
  { code: 32, name: '島根県', region: '中国', lat: 35.472, lng: 133.051 },
  { code: 33, name: '岡山県', region: '中国', lat: 34.662, lng: 133.935 },
  { code: 34, name: '広島県', region: '中国', lat: 34.397, lng: 132.46 },
  { code: 35, name: '山口県', region: '中国', lat: 34.186, lng: 131.471 },
  { code: 36, name: '徳島県', region: '四国', lat: 34.066, lng: 134.559 },
  { code: 37, name: '香川県', region: '四国', lat: 34.34, lng: 134.043 },
  { code: 38, name: '愛媛県', region: '四国', lat: 33.842, lng: 132.766 },
  { code: 39, name: '高知県', region: '四国', lat: 33.56, lng: 133.531 },
  { code: 40, name: '福岡県', region: '九州・沖縄', lat: 33.607, lng: 130.418 },
  { code: 41, name: '佐賀県', region: '九州・沖縄', lat: 33.249, lng: 130.299 },
  { code: 42, name: '長崎県', region: '九州・沖縄', lat: 32.745, lng: 129.874 },
  { code: 43, name: '熊本県', region: '九州・沖縄', lat: 32.79, lng: 130.742 },
  { code: 44, name: '大分県', region: '九州・沖縄', lat: 33.238, lng: 131.613 },
  { code: 45, name: '宮崎県', region: '九州・沖縄', lat: 31.911, lng: 131.424 },
  { code: 46, name: '鹿児島県', region: '九州・沖縄', lat: 31.56, lng: 130.558 },
  { code: 47, name: '沖縄県', region: '九州・沖縄', lat: 26.212, lng: 127.681 },
]

const BY_CODE = new Map(PREFECTURES.map((p) => [p.code, p]))

export function getPrefecture(code: number | null | undefined): Prefecture | undefined {
  return code == null ? undefined : BY_CODE.get(code)
}
