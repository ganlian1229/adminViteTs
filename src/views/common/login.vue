<template>
    <main class="login-page">
        <section class="intro-panel">
            <router-link class="brand" to="/login"
                ><span class="brand-mark">a.</span><span>Admin Vite TS</span></router-link
            >
            <div class="intro-content">
                <h2 class="intro-title">从这里开始，<br />构建你的管理工作台。</h2>
                <p class="intro-description">轻量、清晰、易扩展。让每一次开发，<br />都能专注于业务本身。</p>
                <div class="framework-preview" aria-hidden="true">
                    <div class="preview-nav">
                        <span class="preview-dot"></span><span class="preview-link">首页</span>
                        <span class="preview-link">内容</span><span class="preview-link">组件</span>
                    </div>
                    <div class="preview-body">
                        <div class="preview-heading">Workspace</div>
                        <div class="preview-metrics"><span>Vue 3</span><span>TypeScript</span></div>
                        <div class="preview-row"><span>路由导航</span><span>已配置</span></div>
                        <div class="preview-row"><span>公共组件</span><span>可复用</span></div>
                        <div class="preview-row"><span>界面主题</span><span>已统一</span></div>
                    </div>
                </div>
            </div>
            <div class="intro-footer">Vue 3 · Vite · TypeScript · Element Plus</div>
        </section>
        <section class="form-panel">
            <div class="login-form">
                <span class="mobile-brand">Admin Vite TS</span>
                <h1 class="form-title">登录工作台</h1>
                <p class="form-description">欢迎使用，请输入你的账号信息。</p>
                <el-form
                    ref="ruleFormRef"
                    class="account-form"
                    :model="ruleForm"
                    :rules="rules"
                    labelPosition="top"
                    @submit.prevent="submitForm(ruleFormRef)"
                >
                    <el-form-item label="用户名" prop="username"
                        ><el-input
                            v-model="ruleForm.username"
                            placeholder="请输入用户名"
                            size="large"
                            autocomplete="username"
                            ><template #prefix
                                ><el-icon><User /></el-icon></template></el-input
                    ></el-form-item>
                    <el-form-item label="密码" prop="password"
                        ><el-input
                            v-model="ruleForm.password"
                            type="password"
                            showPassword
                            placeholder="请输入密码"
                            size="large"
                            autocomplete="current-password"
                            ><template #prefix
                                ><el-icon><Lock /></el-icon></template></el-input
                    ></el-form-item>
                    <el-button class="login-button" type="primary" size="large" nativeType="submit"
                        >登录 <el-icon><Right /></el-icon
                    ></el-button>
                </el-form>
                <p class="demo-note">
                    <el-icon><InfoFilled /></el-icon>当前为模板演示，已预填示例账号。
                </p>
            </div>
            <div class="form-footer">Admin Vite TS · 管理系统模板</div>
        </section>
    </main>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import storeObj from '@/store';
import dynamicRouter from '@/router/dynamicRouter';
import { addRouter } from '@/utils';
/** 登录成功后使用的路由实例。 */
const router = useRouter();
/** 写入登录用户的 store 操作。 */
const { setUserInfo } = storeObj.mainStore;
/** 模板原有演示账号，直接赋值给表单。 */
const ruleForm = reactive({ username: 'admin', password: '123456' });
/** Element Plus 表单校验配置。 */
const rules: FormRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
/** 登录表单实例。 */
const ruleFormRef = ref<FormInstance>();
/** 登录；formRef 为表单实例；返回 Promise<void>；校验通过后保存演示会话并注册路由。 */
async function submitForm(formRef?: FormInstance): Promise<void> {
    if (!formRef) return;
    const valid = await formRef.validate().catch(() => false);
    if (!valid) return;
    setUserInfo({ userId: 1 });
    addRouter(dynamicRouter);
    sessionStorage.setItem('isLogin', 'true');
    router.replace('/main/index');
}
</script>
<style lang="scss" scoped>
.login-page {
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #fff;
    .intro-panel {
        background: #edf2f3;
        padding: 40px 10%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 40px;
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--app-ink);
            text-decoration: none;
            font-size: 17px;
            font-weight: bold;
            .brand-mark {
                font-size: 38px;
                color: var(--app-accent);
                line-height: 1;
            }
        }
        .intro-content {
            max-width: 420px;
            .intro-title {
                margin: 0;
                font-size: clamp(25px, 2.4vw, 36px);
                line-height: 1.55;
                font-weight: bold;
            }
            .intro-description {
                margin: 20px 0 36px;
                font-size: 15px;
                line-height: 1.9;
                color: #53666f;
            }
            .framework-preview {
                display: flex;
                height: 208px;
                background: #fff;
                border: 1px solid #dbe4e7;
                border-radius: 8px;
                overflow: hidden;
                transform: rotate(-3deg);
                .preview-nav {
                    width: 72px;
                    flex-shrink: 0;
                    padding: 20px 14px;
                    box-sizing: border-box;
                    background: #f6f8f9;
                    .preview-dot {
                        display: block;
                        height: 12px;
                        width: 12px;
                        margin-bottom: 26px;
                        border-radius: 50%;
                        background: var(--app-accent);
                    }
                    .preview-link {
                        display: block;
                        font-size: 11px;
                        color: var(--app-muted);
                        margin-bottom: 18px;
                    }
                }
                .preview-body {
                    flex: 1;
                    padding: 24px;
                    box-sizing: border-box;
                    .preview-heading {
                        font-size: 15px;
                        font-weight: bold;
                        margin-bottom: 16px;
                    }
                    .preview-metrics {
                        display: flex;
                        gap: 18px;
                        color: var(--app-accent);
                        margin-bottom: 16px;
                        font-size: 12px;
                    }
                    .preview-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 11px;
                        color: var(--app-muted);
                        margin-top: 13px;
                    }
                }
            }
        }
        .intro-footer {
            font-size: 12px;
            color: var(--app-muted);
        }
    }
    .form-panel {
        min-width: 0;
        padding: 40px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .login-form {
            width: 360px;
            max-width: 100%;
            .mobile-brand {
                display: none;
            }
            .form-title {
                font-size: 26px;
                font-weight: bold;
                margin: 0 0 12px;
            }
            .form-description {
                color: var(--app-muted);
                font-size: 14px;
                margin: 0 0 36px;
            }
            .account-form {
                .login-button {
                    width: 100%;
                    margin-top: 12px;
                    display: flex;
                    gap: 12px;
                }
            }
            .demo-note {
                display: flex;
                align-items: center;
                gap: 7px;
                margin-top: 22px;
                font-size: 12px;
                color: var(--app-muted);
            }
        }
        .form-footer {
            position: absolute;
            bottom: 30px;
            color: var(--app-muted);
            font-size: 12px;
        }
    }
}
@media (max-width: 760px) {
    .login-page {
        grid-template-columns: 1fr;
        .intro-panel {
            display: none;
        }
        .form-panel {
            padding: 32px 24px 80px;
            box-sizing: border-box;
            .login-form {
                .mobile-brand {
                    display: block;
                    color: var(--app-accent);
                    margin-bottom: 44px;
                    font-size: 17px;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
