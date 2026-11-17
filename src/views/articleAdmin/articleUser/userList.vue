<template>
    <div class="user-page content-page">
        <h1 class="page-title">用户列表</h1>
        <p class="page-description">文章人员管理，当前页面尚未接入用户数据。</p>
        <commonTable :data="[]" :showPagination="false"
            ><el-table-column label="姓名" prop="name" /><el-table-column label="手机号" prop="phone" /><el-table-column
                label="状态"
                prop="status"
        /></commonTable>
    </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.user-page {
    min-width: 0;
}
</style>
