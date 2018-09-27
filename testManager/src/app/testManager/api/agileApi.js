import { stores, axios } from 'choerodon-front-boot';

const { AppState } = stores;

// export function getVersionCode() {
//   const projectId = AppState.currentMenuType.id;
//   return axios.get(`agile/v1/projects/${projectId}/lookup_values/version`);
// }

/**
 *获取当前项目的所有版本
 *
 * @export
 * @returns
 */
export function getProjectVersion() {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`agile/v1/projects/${projectId}/product_version/versions`);
}
/**
 *获取缺陷列表（排除test类型）
 *
 * @export
 * @param {*} summary
 * @returns
 */
export function getIssuesForDefects(summary) {
  const projectId = AppState.currentMenuType.id;
  const advancedSearchArgs = {
    typeCode: ['sub_task', 'story', 'task', 'issue_epic', 'bug'],
  };
  const searchArgs = {};
  if (summary) {
    searchArgs.summary = summary;
  }
  return axios.post(`agile/v1/projects/${projectId}/issues/test_component/no_sub`, { advancedSearchArgs, searchArgs });
}
/**
 *获取根据筛选条件获取issues
 *
 * @export
 * @param {*} summary
 * @param {*} type
 * @returns
 */
export function getIssueList(summary, type) {
  const projectId = AppState.currentMenuType.id;
  const advancedSearchArgs = {};
  const searchArgs = {};
  if (type) {
    advancedSearchArgs.typeCode = ['issue_test'];
  }
  if (summary) {
    searchArgs.summary = summary;
  }
  return axios.post(`agile/v1/projects/${projectId}/issues/test_component/no_sub`, { advancedSearchArgs, searchArgs });
}
/**
 *获取根据筛选条件获取issues
 *
 * @export
 * @param {*} search
 * @param {*} pagination
 * @returns
 */
export function getIssueListSearch(search, pagination) {
  const projectId = AppState.currentMenuType.id;
  const { page, size } = pagination;
  return axios.post(`agile/v1/projects/${projectId}/issues/test_component/no_sub?size=${size}&page=${page}`, search);
}
/**
 *获取当前项目的模块
 *
 * @export
 * @returns
 */
export function getModules() {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`agile/v1/projects/${projectId}/component`);
}
/**
 *获取当前项目的标签
 *
 * @export
 * @returns
 */
export function getLabels() {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`agile/v1/projects/${projectId}/issue_labels`);
}
/**
 *获取当前项目的issue优先级
 *
 * @export
 * @returns
 */
export function getPrioritys() {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`agile/v1/projects/${projectId}/lookup_values/priority`);
}
/**
 *获取当前项目的issue状态列表
 *
 * @export
 * @returns
 */
export function getIssueStatus() {
  const projectId = AppState.currentMenuType.id;
  return axios.get(`agile/v1/projects/${projectId}/issue_status/list`);
}
/**
 *获取测试类型issue数量
 *
 * @export
 * @param {*} search
 * @returns
 */
export function getIssueCount(search) {
  const projectId = AppState.currentMenuType.id;

  return axios.post(`agile/v1/projects/${projectId}/issues/test_component/no_sub`, search);
}
