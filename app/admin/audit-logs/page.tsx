"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_KEY } from "@/lib/admin-auth";

type Action = "INSERT" | "UPDATE" | "DELETE";
type TableName = "stories" | "events" | "event_info" | "stamps";

interface AuditRow {
  id: number;
  table_name: TableName;
  row_id: string;
  action: Action;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  actor: string;
  changed_at: string;
}

const TABLE_LABEL: Record<TableName, string> = {
  stories: "부평 이야기",
  events: "행사 정보",
  event_info: "행사 안내",
  stamps: "스탬프",
};

const ACTION_LABEL: Record<Action, string> = {
  INSERT: "추가",
  UPDATE: "수정",
  DELETE: "삭제",
};

const ACTION_BADGE: Record<Action, string> = {
  INSERT: "bg-green-100 text-green-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function AuditLogsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tableFilter, setTableFilter] = useState<TableName | "">("");
  const [actionFilter, setActionFilter] = useState<Action | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const [detail, setDetail] = useState<AuditRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (tableFilter) params.set("table", tableFilter);
    if (actionFilter) params.set("action", actionFilter);
    if (fromDate) params.set("from", new Date(fromDate).toISOString());
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      params.set("to", end.toISOString());
    }
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));

    try {
      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
        headers: { "x-admin-key": ADMIN_KEY },
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setRows(json.rows);
      setTotal(json.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "조회 실패");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [tableFilter, actionFilter, fromDate, toDate, page]);

  // 인증 게이트
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    const authTime = localStorage.getItem("adminAuthTime");
    if (!auth || !authTime || Date.now() - parseInt(authTime) > 3600000) {
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminAuthTime");
      router.push("/admin");
      return;
    }
    load();
  }, [router, load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const resetFilters = () => {
    setTableFilter("");
    setActionFilter("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-600 hover:text-gray-900"
            aria-label="뒤로"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">변경 이력</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
        {/* 필터 */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={tableFilter}
            onChange={(e) => { setTableFilter(e.target.value as TableName | ""); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">전체 항목</option>
            {(Object.keys(TABLE_LABEL) as TableName[]).map((t) => (
              <option key={t} value={t}>{TABLE_LABEL[t]}</option>
            ))}
          </select>

          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value as Action | ""); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">전체 작업</option>
            {(Object.keys(ACTION_LABEL) as Action[]).map((a) => (
              <option key={a} value={a}>{ACTION_LABEL[a]}</option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />

          <button
            onClick={resetFilters}
            className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            필터 초기화
          </button>
        </div>

        {/* 결과 */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">불러오는 중...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-600 text-sm whitespace-pre-wrap">{error}</div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-gray-500">기록이 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">시간</th>
                  <th className="px-4 py-3 font-medium">항목</th>
                  <th className="px-4 py-3 font-medium">작업</th>
                  <th className="px-4 py-3 font-medium">대상 ID</th>
                  <th className="px-4 py-3 font-medium">작업자</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {new Date(r.changed_at).toLocaleString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-gray-900">{TABLE_LABEL[r.table_name] ?? r.table_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${ACTION_BADGE[r.action]}`}>
                        {ACTION_LABEL[r.action]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.row_id.slice(0, 8)}...</td>
                    <td className="px-4 py-3 text-gray-700">{r.actor}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDetail(r)}
                        className="text-sm text-gray-700 hover:text-gray-900 underline"
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 페이지네이션 */}
        {!loading && !error && total > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>전체 {total.toLocaleString()}건 / {page} / {totalPages} 페이지</div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
              >
                이전
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {detail && <DetailModal row={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function DetailModal({ row, onClose }: { row: AuditRow; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">
              {new Date(row.changed_at).toLocaleString("ko-KR")} · {row.actor}
            </div>
            <div className="text-base font-medium text-gray-900">
              {TABLE_LABEL[row.table_name] ?? row.table_name} · {ACTION_LABEL[row.action]}
            </div>
            <div className="text-xs font-mono text-gray-400 mt-1">{row.row_id}</div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl leading-none">×</button>
        </div>

        <div className="overflow-auto px-6 py-4">
          <DiffView row={row} />
        </div>
      </div>
    </div>
  );
}

function DiffView({ row }: { row: AuditRow }) {
  if (row.action === "INSERT") {
    return <FullJsonBlock label="추가된 내용" data={row.new_data} />;
  }
  if (row.action === "DELETE") {
    return <FullJsonBlock label="삭제된 내용" data={row.old_data} />;
  }

  // UPDATE: 변경된 키만 추리기
  const oldData = row.old_data ?? {};
  const newData = row.new_data ?? {};
  const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]));
  const changedKeys = allKeys.filter((k) => !deepEqual(oldData[k], newData[k]));

  if (changedKeys.length === 0) {
    return <div className="text-sm text-gray-500">변경된 컬럼이 없습니다 (자기참조 업데이트).</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">변경된 항목 {changedKeys.length}개</div>
      {changedKeys.map((k) => (
        <div key={k} className="border border-gray-200 rounded-md overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 text-sm font-mono text-gray-700">{k}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200">
            <div className="px-3 py-2">
              <div className="text-xs text-red-600 mb-1">변경 전</div>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">{formatVal(oldData[k])}</pre>
            </div>
            <div className="px-3 py-2">
              <div className="text-xs text-green-600 mb-1">변경 후</div>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap break-all">{formatVal(newData[k])}</pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FullJsonBlock({ label, data }: { label: string; data: unknown }) {
  return (
    <div>
      <div className="text-sm text-gray-600 mb-2">{label}</div>
      <pre className="text-xs bg-gray-50 border border-gray-200 rounded-md p-3 whitespace-pre-wrap break-all">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

function formatVal(v: unknown): string {
  if (v === null || v === undefined) return "(없음)";
  if (typeof v === "string") return v;
  return JSON.stringify(v, null, 2);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  return JSON.stringify(a) === JSON.stringify(b);
}
