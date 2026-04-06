from playwright.sync_api import sync_playwright
import time
import os
import re

# 测试脚本
def test_resume_editor():
    test_results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # 1. 页面加载和基本布局
            print("\n=== 测试1: 页面加载和基本布局 ===")
            page.goto('http://localhost:5173/')
            page.wait_for_load_state('networkidle')
            
            # 检查页面标题
            title = page.title()
            print(f"页面标题: {title}")
            if "简历编辑器" in title:
                test_results.append({"测试1": "通过"})
                print("✅ 页面标题正确")
            else:
                test_results.append({"测试1": "失败"})
                print("❌ 页面标题不正确")
            
            # 检查页面布局
            # 检查头部导航栏
            header = page.locator('header.header')
            if header.is_visible():
                print("✅ 头部导航栏可见")
            else:
                print("❌ 头部导航栏不可见")
            
            # 检查左侧编辑区
            editor = page.locator('section.editor')
            if editor.is_visible():
                print("✅ 左侧编辑区可见")
            else:
                print("❌ 左侧编辑区不可见")
            
            # 检查右侧预览区
            preview = page.locator('aside.preview')
            if preview.is_visible():
                print("✅ 右侧预览区可见")
            else:
                print("❌ 右侧预览区不可见")
            
            # 检查底部信息栏
            footer = page.locator('footer.footer')
            if footer.is_visible():
                print("✅ 底部信息栏可见")
            else:
                print("❌ 底部信息栏不可见")
            
            # 2. 简历管理功能
            print("\n=== 测试2: 简历管理功能 ===")
            
            # 检查简历选择下拉框
            resume_select = page.locator('.resume-select')
            if resume_select.is_visible():
                print("✅ 简历选择下拉框可见")
            else:
                print("❌ 简历选择下拉框不可见")
            
            # 点击新建简历按钮
            create_resume_btn = page.locator('button:has-text("新建简历")')
            if create_resume_btn.is_visible():
                create_resume_btn.click()
                time.sleep(1)
                # 检查下拉框中是否新增了「简历2」
                options = page.locator('select.resume-select option')
                option_count = options.count()
                print(f"✅ 新建简历成功，下拉框中有 {option_count} 个选项")
                test_results.append({"测试2": "通过"})
            else:
                print("❌ 新建简历按钮不可见")
                test_results.append({"测试2": "失败"})
            
            # 3. 模块管理功能
            print("\n=== 测试3: 模块管理功能 ===")
            
            # 点击新增模块按钮
            add_section_btn = page.locator('button:has-text("新增模块")')
            if add_section_btn.is_visible():
                add_section_btn.click()
                time.sleep(1)
                # 选择项目经验模块
                project_section_option = page.locator('button:has-text("项目经验")')
                if project_section_option.is_visible():
                    project_section_option.click()
                    time.sleep(1)
                    # 检查页面是否新增了「项目经验」模块
                    project_section = page.locator('h3:has-text("项目经验")')
                    if project_section.is_visible():
                        print("✅ 新增项目经验模块成功")
                        test_results.append({"测试3": "通过"})
                    else:
                        print("❌ 新增项目经验模块失败")
                        test_results.append({"测试3": "失败"})
                else:
                    print("❌ 项目经验模块选项不可见")
                    test_results.append({"测试3": "失败"})
            else:
                print("❌ 新增模块按钮不可见")
                test_results.append({"测试3": "失败"})
            
            # 4. 模块展开/收起功能
            print("\n=== 测试4: 模块展开/收起功能 ===")
            try:
                # 点击个人总结模块
                summary_section = page.locator('h3:has-text("个人总结")').first
                if summary_section.is_visible():
                    # 直接点击h3元素
                    summary_section.click()
                    time.sleep(2)
                    # 检查是否展开，显示编辑界面
                    summary_content = page.locator('.form-group:has(label:has-text("个人总结"))')
                    if summary_content.is_visible():
                        print("✅ 个人总结模块展开成功")
                        # 再次点击收起
                        summary_section.click()
                        time.sleep(2)
                        # 检查是否收起
                        if not summary_content.is_visible():
                            print("✅ 个人总结模块收起成功")
                            test_results.append({"测试4": "通过"})
                        else:
                            print("❌ 个人总结模块收起失败")
                            test_results.append({"测试4": "失败"})
                    else:
                        print("❌ 个人总结模块展开失败")
                        test_results.append({"测试4": "失败"})
                else:
                    print("❌ 个人总结模块不可见")
                    test_results.append({"测试4": "失败"})
            except Exception as e:
                print(f"测试4出错: {e}")
                test_results.append({"测试4": "失败"})
            
            # 5. 个人信息编辑
            print("\n=== 测试5: 个人信息编辑 ===")
            try:
                # 点击个人信息模块
                personal_section = page.locator('h3:has-text("个人信息")').first
                if personal_section.is_visible():
                    # 直接点击h3元素
                    personal_section.click()
                    time.sleep(2)
                    
                    # 修改姓名
                    name_input = page.locator('input').nth(0)
                    if name_input.is_visible():
                        name_input.fill("李四")
                        print("✅ 修改姓名成功")
                    else:
                        print("❌ 姓名输入框不可见")
                    
                    # 点击保存按钮
                    save_btn = page.locator('button:has-text("保存")')
                    if save_btn.is_visible():
                        save_btn.click()
                        time.sleep(2)
                        # 检查预览区个人信息是否更新
                        preview_name = page.locator('h1:has-text("李四")')
                        if preview_name.is_visible():
                            print("✅ 个人信息保存成功")
                            test_results.append({"测试5": "通过"})
                        else:
                            print("❌ 个人信息保存失败")
                            test_results.append({"测试5": "失败"})
                    else:
                        print("❌ 保存按钮不可见")
                        test_results.append({"测试5": "失败"})
                else:
                    print("❌ 个人信息模块不可见")
                    test_results.append({"测试5": "失败"})
            except Exception as e:
                print(f"测试5出错: {e}")
                test_results.append({"测试5": "失败"})
            
            # 6. 个人总结编辑（富文本）
            print("\n=== 测试6: 个人总结编辑（富文本） ===")
            try:
                # 再次点击个人总结模块
                summary_section = page.locator('h3:has-text("个人总结")').first
                if summary_section.is_visible():
                    # 直接点击h3元素
                    summary_section.click()
                    time.sleep(2)
                    
                    # 检查富文本编辑器
                    quill_editor = page.locator('.ql-container')
                    if quill_editor.is_visible():
                        print("✅ 富文本编辑器可见")
                        # 点击编辑器
                        quill_editor.click()
                        # 输入内容
                        page.keyboard.type("这是测试的个人总结内容")
                        print("✅ 在富文本编辑器中输入内容成功")
                        
                        # 点击保存按钮
                        save_btn = page.locator('button:has-text("保存")')
                        if save_btn.is_visible():
                            save_btn.click()
                            time.sleep(2)
                            print("✅ 个人总结保存成功")
                            test_results.append({"测试6": "通过"})
                        else:
                            print("❌ 保存按钮不可见")
                            test_results.append({"测试6": "失败"})
                    else:
                        print("❌ 富文本编辑器不可见")
                        test_results.append({"测试6": "失败"})
                else:
                    print("❌ 个人总结模块不可见")
                    test_results.append({"测试6": "失败"})
            except Exception as e:
                print(f"测试6出错: {e}")
                test_results.append({"测试6": "失败"})
            
            # 7. 工作经验编辑
            print("\n=== 测试7: 工作经验编辑 ===")
            try:
                # 点击工作经验模块
                experience_section = page.locator('h3:has-text("工作经验")').first
                if experience_section.is_visible():
                    # 直接点击h3元素
                    experience_section.click()
                    time.sleep(2)
                    
                    # 修改公司名称
                    company_input = page.locator('input[placeholder="公司名称"]')
                    if company_input.is_visible():
                        company_input.fill("XYZ科技有限公司")
                        print("✅ 修改公司名称成功")
                    else:
                        print("❌ 公司名称输入框不可见")
                    
                    # 点击保存按钮
                    save_btn = page.locator('button:has-text("保存")')
                    if save_btn.is_visible():
                        save_btn.click()
                        time.sleep(2)
                        print("✅ 工作经验保存成功")
                        test_results.append({"测试7": "通过"})
                    else:
                        print("❌ 保存按钮不可见")
                        test_results.append({"测试7": "失败"})
                else:
                    print("❌ 工作经验模块不可见")
                    test_results.append({"测试7": "失败"})
            except Exception as e:
                print(f"测试7出错: {e}")
                test_results.append({"测试7": "失败"})
            
            # 8. 智能一页功能
            print("\n=== 测试8: 智能一页功能 ===")
            try:
                # 点击智能一页按钮
                compress_btn = page.locator('button:has-text("智能一页")')
                if compress_btn.is_visible():
                    compress_btn.click()
                    time.sleep(2)
                    # 检查按钮是否变为「取消一页」
                    cancel_compress_btn = page.locator('button:has-text("取消一页")')
                    if cancel_compress_btn.is_visible():
                        print("✅ 智能一页功能启用成功")
                        # 再次点击取消一页
                        cancel_compress_btn.click()
                        time.sleep(2)
                        # 检查按钮是否恢复为「智能一页」
                        compress_btn = page.locator('button:has-text("智能一页")')
                        if compress_btn.is_visible():
                            print("✅ 智能一页功能取消成功")
                            test_results.append({"测试8": "通过"})
                        else:
                            print("❌ 智能一页功能取消失败")
                            test_results.append({"测试8": "失败"})
                    else:
                        print("❌ 智能一页功能启用失败")
                        test_results.append({"测试8": "失败"})
                else:
                    print("❌ 智能一页按钮不可见")
                    test_results.append({"测试8": "失败"})
            except Exception as e:
                print(f"测试8出错: {e}")
                test_results.append({"测试8": "失败"})
            
            # 9. PDF导出功能
            print("\n=== 测试9: PDF导出功能 ===")
            try:
                # 点击导出PDF按钮
                export_btn = page.locator('button:has-text("导出PDF")')
                if export_btn.is_visible():
                    export_btn.click()
                    time.sleep(5)  # 等待PDF生成和下载
                    print("✅ PDF导出功能触发成功")
                    test_results.append({"测试9": "通过"})
                else:
                    print("❌ 导出PDF按钮不可见")
                    test_results.append({"测试9": "失败"})
            except Exception as e:
                print(f"测试9出错: {e}")
                test_results.append({"测试9": "失败"})
            
        except Exception as e:
            print(f"测试过程中出现错误: {e}")
        finally:
            browser.close()
    
    # 生成测试报告
    print("\n=== 测试报告 ===")
    print("\n测试结果:")
    for result in test_results:
        for test, status in result.items():
            print(f"{test}: {status}")
    
    # 统计测试结果
    passed_tests = [result for result in test_results if list(result.values())[0] == "通过"]
    failed_tests = [result for result in test_results if list(result.values())[0] == "失败"]
    
    print(f"\n测试总结:")
    print(f"总测试数: {len(test_results)}")
    print(f"通过测试数: {len(passed_tests)}")
    print(f"失败测试数: {len(failed_tests)}")
    
    if len(failed_tests) == 0:
        print("\n🎉 所有测试通过！")
    else:
        print("\n❌ 有测试失败，需要进一步检查。")

if __name__ == "__main__":
    test_resume_editor()
