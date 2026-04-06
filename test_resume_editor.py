from playwright.sync_api import sync_playwright
import time

# 测试脚本
def test_resume_editor():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # 访问应用
        page.goto('http://localhost:5175/')
        page.wait_for_load_state('networkidle')
        print("应用加载成功")
        
        # 测试1: 检查应用标题
        title = page.title()
        print(f"应用标题: {title}")
        assert "简历编辑器" in title, "应用标题不正确"
        
        # 测试2: 检查简历管理功能
        print("\n测试简历管理功能...")
        # 检查下拉框
        resume_select = page.locator('.resume-select')
        assert resume_select.is_visible(), "简历选择下拉框不可见"
        print("简历选择下拉框可见")
        
        # 测试3: 检查新建简历按钮
        create_resume_btn = page.locator('button:has-text("新建简历")')
        assert create_resume_btn.is_visible(), "新建简历按钮不可见"
        print("新建简历按钮可见")
        
        # 测试4: 检查删除简历按钮
        delete_resume_btn = page.locator('button:has-text("删除简历")')
        assert delete_resume_btn.is_visible(), "删除简历按钮不可见"
        print("删除简历按钮可见")
        
        # 测试5: 检查重命名按钮
        rename_resume_btn = page.locator('button:has-text("重命名")')
        assert rename_resume_btn.is_visible(), "重命名按钮不可见"
        print("重命名按钮可见")
        
        # 测试6: 检查新增模块按钮
        add_section_btn = page.locator('button:has-text("新增模块")')
        assert add_section_btn.is_visible(), "新增模块按钮不可见"
        print("新增模块按钮可见")
        
        # 测试7: 检查智能一页按钮
        compress_btn = page.locator('button:has-text("智能一页")')
        assert compress_btn.is_visible(), "智能一页按钮不可见"
        print("智能一页按钮可见")
        
        # 测试8: 检查导出PDF按钮
        export_btn = page.locator('button:has-text("导出PDF")')
        assert export_btn.is_visible(), "导出PDF按钮不可见"
        print("导出PDF按钮可见")
        
        # 测试9: 检查个人信息模块
        print("\n测试个人信息模块...")
        personal_section = page.locator('h3:has-text("个人信息")')
        assert personal_section.is_visible(), "个人信息模块不可见"
        print("个人信息模块可见")
        
        # 测试10: 检查个人总结模块
        summary_section = page.locator('h3:has-text("个人总结")')
        assert summary_section.is_visible(), "个人总结模块不可见"
        print("个人总结模块可见")
        
        # 测试11: 检查工作经验模块
        experience_section = page.locator('h3:has-text("工作经验")')
        assert experience_section.is_visible(), "工作经验模块不可见"
        print("工作经验模块可见")
        
        # 测试12: 检查教育背景模块
        education_section = page.locator('h3:has-text("教育背景")')
        assert education_section.is_visible(), "教育背景模块不可见"
        print("教育背景模块可见")
        
        # 测试13: 检查技能模块
        skills_section = page.locator('h3:has-text("技能")')
        assert skills_section.is_visible(), "技能模块不可见"
        print("技能模块可见")
        
        # 测试14: 测试模块展开/收起功能
        print("\n测试模块展开/收起功能...")
        # 点击个人总结模块
        summary_section.click()
        time.sleep(1)
        # 检查是否展开
        summary_content = page.locator('.form-group:has(label:has-text("个人总结"))')
        assert summary_content.is_visible(), "个人总结模块展开失败"
        print("个人总结模块展开成功")
        
        # 再次点击收起
        summary_section.click()
        time.sleep(1)
        # 检查是否收起
        assert not summary_content.is_visible(), "个人总结模块收起失败"
        print("个人总结模块收起成功")
        
        # 测试15: 测试新增模块功能
        print("\n测试新增模块功能...")
        add_section_btn.click()
        time.sleep(1)
        # 选择项目经验模块
        project_section_option = page.locator('button:has-text("项目经验")')
        assert project_section_option.is_visible(), "项目经验模块选项不可见"
        project_section_option.click()
        time.sleep(1)
        # 检查项目经验模块是否添加成功
        project_section = page.locator('h3:has-text("项目经验")')
        assert project_section.is_visible(), "项目经验模块添加失败"
        print("项目经验模块添加成功")
        
        # 测试16: 测试保存和取消功能
        print("\n测试保存和取消功能...")
        # 展开项目经验模块
        project_section.click()
        time.sleep(1)
        # 检查保存和取消按钮
        save_btn = page.locator('button:has-text("保存")')
        cancel_btn = page.locator('button:has-text("取消")')
        assert save_btn.is_visible(), "保存按钮不可见"
        assert cancel_btn.is_visible(), "取消按钮不可见"
        print("保存和取消按钮可见")
        
        # 测试17: 测试子模块添加功能
        print("\n测试子模块添加功能...")
        add_item_btn = page.locator('button:has-text("新增项目经历")')
        assert add_item_btn.is_visible(), "新增项目经历按钮不可见"
        print("新增项目经历按钮可见")
        
        # 测试18: 测试富文本编辑器
        print("\n测试富文本编辑器...")
        # 展开个人总结模块
        summary_section.click()
        time.sleep(1)
        # 检查富文本编辑器
        quill_editor = page.locator('.ql-container')
        assert quill_editor.is_visible(), "富文本编辑器不可见"
        print("富文本编辑器可见")
        
        # 测试19: 测试预览功能
        print("\n测试预览功能...")
        preview_section = page.locator('.preview')
        assert preview_section.is_visible(), "预览区不可见"
        print("预览区可见")
        
        # 测试20: 测试深色主题
        print("\n测试深色主题...")
        # 检查背景颜色是否为深色
        body = page.locator('body')
        bg_color = body.evaluate('el => getComputedStyle(el).backgroundColor')
        print(f"页面背景颜色: {bg_color}")
        # 深色主题背景应该是深色的
        assert 'rgb(17, 17, 17)' in bg_color or 'rgb(30, 30, 30)' in bg_color, "深色主题未启用"
        print("深色主题启用成功")
        
        # 测试21: 测试下拉框样式
        print("\n测试下拉框样式...")
        # 检查下拉框背景颜色
        select_style = resume_select.evaluate('el => getComputedStyle(el).backgroundColor')
        print(f"下拉框背景颜色: {select_style}")
        # 下拉框背景应该是深色的
        assert 'rgb(30, 30, 30)' in select_style, "下拉框样式不正确"
        print("下拉框样式正确")
        
        # 测试完成
        print("\n✅ 所有测试通过！应用功能正常运行。")
        
        browser.close()

if __name__ == "__main__":
    test_resume_editor()
